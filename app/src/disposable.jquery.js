(function ($, undefined) {
  /**
   * Creates a new Disposable helper object
   */
  $.Disposable = function () {
    if ( !(this instanceof $.Disposable) )  {
      return new $.Disposable();
    }

    // Callback functions to be disposed
    this._callbacks = [];

    // jQuery events to be disposed
    this._jQueries = [];

    // BEM events to be disposed
    this._bems = [];

    // Ymaps events to be disposed
    this._ymaps = [];

    // jqXHRs to be disposed
    // experimental
    this._ajaxes = [];
  };

  /**
   * A callback function wrapper
   * Returns a new function that can be disposed
   */
  $.Disposable.prototype.callback = function (fn, ctx) {
    var host = {
      fn: fn,
      callback: function () {
        var context = ctx ? ctx : this;
        return host.fn.apply(context, arguments);
      }
    };

    this._callbacks.push(host);

    return host.callback;
  };

  /**
   * Disposes all registered callbacks
   */
  $.Disposable.prototype._disposeCallback = function () {
    var host;

    while (this._callbacks.length) {
      host = this._callbacks.pop();
      host.fn = $.noop;
    }
  };

  /**
   * A jQuery object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.jQuery = function (elem) {
    var that = this;

    return {
      /**
       * Attaches events to the jQuery object
       * Returns the jQuery object
       */
      on : function (types, selector, data, fn) {
        // Later on dispose we need to unbind this event(s) with $.fn.off method,
        // wich doesn't accept data parameter, so we need to filter through arguments below.

        // Array of arguments to be passed to $.fn.off on dispose
        var args = [ types ];

        // Building array of arguments, filtering out the data param if present
        if (typeof types === "object") {
          if (typeof selector === "string") {
            args.push(selector);
          }
        } else if ( data == null && fn == null ) {
          args.push(selector);
        } else if (fn == null) {
          if ( typeof selector === "string" ) {
            args.push(selector);
          }
          args.push(data);
        } else {
          args.push(fn);
        }

        that._jQueries.push({
          context: elem,
          args: args
        });

        $.fn.on.apply(elem, arguments);

        return elem;
      }
    };
  };

  /**
   * Disposes all registered jQuery events
   */
  $.Disposable.prototype._disposeJQuery = function () {
    var host;

    while (this._jQueries.length) {
      host = this._jQueries.pop();
      $.fn.off.apply(host.context, host.args);
    }
  };

  /**
   * A BEM block wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.BEM = function (elem) {
    var that = this;

    return {
      /**
       * Attaches events to the BEM block
       * Returns the BEM block
       */
      on : function (e, data, fn, ctx) {
        // Later on dispose we need to unbind this event(s) with BEM.un method,
        // wich doesn't accept data parameter, so we need to filter through arguments below.

        // Array of arguments to be passed to BEM.un on dispose
        var args = [ e ];

        // Building array of arguments, filtering out the data param if present
        if (fn == null && ctx == null) {
          args.push(data);
        } else if (ctx == null) {
          if ($.isFunction(fn)) {
            args.push(fn)
          } else {
            args.push(data);
            args.push(fn);
          }
        } else {
          args.push(fn);
          args.push(ctx);
        }

        that._bems.push({
          context: elem,
          args: args
        });

        BEM.on.apply(elem, arguments);

        return elem;
      }
    };
  };

  /**
   * Disposes all registered BEM events
   */
  $.Disposable.prototype._disposeBEM = function () {
    var host;

    while (this._bems.length) {
      host = this._bems.pop();
      BEM.un.apply(host.context, host.args);
    }
  };

  /**
   * A ymaps object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.ymaps = function (elem) {
    var that = this;

    return {
      /**
       * Attaches events to the ymaps object
       * Returns the ymaps object
       */
      on: function (types, callback, context) {
        var args = [ types, callback ];

        if (context) args.push(context);

        that._ymaps.push({
          context: elem.events,
          args: args
        });

        elem.events.add(types, callback, context);

        return elem;
      }
    }
  };

  /**
   * Disposes all registered ymaps events
   */
  $.Disposable.prototype._disposeYmaps = function () {
    var host;

    while (this._ymaps.length) {
      host = this._ymaps.pop();
      host.context.remove.apply(host.context, host.args);
    }
  };

  /**
   * Disposes all registered callbacks and events
   */
  $.Disposable.prototype.dispose = function () {
    this._disposeCallback();
    this._disposeJQuery();
    this._disposeBEM();
    this._disposeYmaps();
    // Experimental
    this._disposeAjax();
  };

  /**
   * Alias function for attaching event callbacks
   */
  $.Disposable.prototype.on = function (elem) {
    var rest = Array.prototype.slice.call(arguments, 1);

    // a jQuery object
    if (elem instanceof $) {
      return this.jQuery(elem).on.apply(this, rest);
    }
    // a BEM block
    else if (elem instanceof BEM) {
      return this.BEM(elem).on.apply(this, rest);
    }
    // a ymaps object
    else if (this._isIEventManager(elem.events)) {
      this.ymaps(elem).on.apply(this, rest);
    }
  };

  // ################################
  // Experimental functionality below
  // ################################

  // Since jQuery.ajax returns a jqXHR object, which implements Promise interface,
  // make a separate functionality for dealing with promises and put ajax on top of it.

  /**
   * Performes an ajax request that can be disposed
   * Acceps the same parameters as jQuery.ajax or a jqHXR object
   * Returns a jqXHR object
   */
  $.Disposable.prototype.ajax = function (jqXHR) {
    if (!this._isJqXHR(jqXHR)) {
      jqXHR = $.ajax.apply(null, arguments);
    }

    this._ajaxes.push(jqXHR);

    return jqXHR;
  };

  /**
   * Disposes all registered jqXHRs
   */
  $.Disposable.prototype._disposeAjax = function () {
    while (this._ajaxes.length) {
      this._ajaxes.pop().abort();
    }
  };

  /**
   * Checks whether given object is a jqXHR object
   */
  $.Disposable.prototype._isJqXHR = function (obj) {
    if (!$.Disposable.prototype._isJqXHR.sample) {
      $.Disposable.prototype._isJqXHR.sample = $.ajax();
    };

    return this._interfaceMatch(obj, $.Disposable.prototype._isJqXHR.sample);
  };

  /**
   * Checks whether given object implements IEventManager interface
   */
  $.Disposable.prototype._isIEventManager = function (obj) {
    if (!$.Disposable.prototype._isIEventManager.sample) {
      var geoObj = new ymaps.GeoObject();
      $.Disposable.prototype._isIEventManager.sample = geoObj.events;
    };

    return this._interfaceMatch(obj, $.Disposable.prototype._isIEventManager.sample);
  };

  /**
   * Compares two objects by interface
   */
  $.Disposable.prototype._interfaceMatch = function (obj1, obj2) {
    var match = true;

    for (var prop in obj1) {
      if (obj2[prop] === undefined) {
        match = false;
        break;
      }
    }

    return match;
  };

}(jQuery));
