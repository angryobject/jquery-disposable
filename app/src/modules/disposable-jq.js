(function ($, Disposable, undefined) {
  /**
   * Creates a jQuery object wrapper
   */
  var Class = function (elem, disposable) {
    this._elem = elem;
    this._disposable = disposable;
  };

  /**
   * Attaches events to the jQuery object
   * Returns itself for further chaining
   */
  Class.prototype.on = function (types, selector, fn, ctx, data) {
    // Later on dispose we need to unbind this event(s) with jQuery.fn.off method,
    // wich doesn't accept data parameter, so we need to filter through arguments below.
    // Also, we need this to bind function(s) to context, if one present.

    if (typeof types === 'object') {
      if (typeof selector === 'string') {
        data = ctx;
        ctx = fn;
        fn = undefined;
      } else {
        data = fn;
        ctx = selector;
        selector = fn = undefined;
      }

      if (ctx) {
        for (type in types) {
          if (types.hasOwnProperty(type)) {
            types[type] = $.proxy(types[type], ctx);
          }
        }
      }
    } else {
      if (typeof selector === 'function') {
        data = ctx;
        ctx = fn;
        fn = selector;
        selector = undefined;
      }

      ctx && (fn = $.proxy(fn, ctx));
    };

    this._disposable._jQueries.push({
      context: this._elem,
      args: [types, selector, fn]
    });

    $.fn.on.call(this._elem, types, selector, data, fn);

    return this;
  };

  /**
   * A jQuery object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.jQuery = function (elem) {
    this._checkDisposable();

    return new Class(elem, this);
  };

  /**
   * Register module
   */
  Disposable.modules.push({

    // Adds member properties
    constructor: function () {
      // jQuery events to be disposed
      this._jQueries = [];
    },

    // Disposes all registered jQuery events
    dispose: function () {
      var host;

      while (this._jQueries.length) {
        host = this._jQueries.pop();
        $.fn.off.apply(host.context, host.args);
      }
    }

  });

}(jQuery, jQuery.Disposable));