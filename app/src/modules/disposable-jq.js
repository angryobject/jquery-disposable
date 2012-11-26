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
  Class.prototype.on = function (types, selector, data, fn, ctx) {
    var args;

    // The context argument is allowed only if
    // the types is passed as string, not an object
    if (typeof types !== "object") {
      // If we have context argument - bind callback to it
      ctx = arguments[arguments.length - 1];
      if (typeof ctx === 'object') {
        arguments[arguments.length - 2] = $.proxy(arguments[arguments.length - 2], ctx);
        arguments = [].slice.call(arguments, 0, -1);
      }
    }

    // Later on dispose we need to unbind this event(s) with $.fn.off method,
    // wich doesn't accept data parameter, so we need to filter through arguments
    args = [types].concat($.grep([].slice.call(arguments, 1), function (arg) {
      return typeof arg !== 'object';
    }));

    this._disposable._jQueries.push({
      context: this._elem,
      args: args
    });

    $.fn.on.apply(this._elem, arguments);

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