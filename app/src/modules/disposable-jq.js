(function ($, Disposable, undefined) {
  /**
   * Creates a jQuery object wrapper
   */
  var JQueryDisposable = function (elem, disposable) {
    this.elem = elem;
    this.disposable = disposable;
  };

  /**
   * Attaches events to the jQuery object
   * Returns itself for further chaining
   */
  JQueryDisposable.prototype.on = function (types, selector, data, fn) {
    // Later on dispose we need to unbind this event(s) with $.fn.off method,
    // wich doesn't accept data parameter, so we need to filter through arguments below.

    // Array of arguments to be passed to $.fn.off on dispose
    var args = [ types ];

    // Building array of arguments, filtering out the data param if present
    if (typeof types === "object") {
      typeof selector === "string" && args.push(selector);
    } else if ( typeof selector === 'function' ) {
      args.push(selector);
    } else if (typeof data === 'function' ) {
      typeof selector === "string" && args.push(selector);
      args.push(data);
    } else {
      args.push(selector, fn);
    }

    this.disposable._jQueries.push({
      context: this.elem,
      args: args
    });

    $.fn.on.apply(this.elem, arguments);

    return this;
  };

  /**
   * A jQuery object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.jQuery = function (elem) {
    return !this._disposed && new JQueryDisposable(elem, this);
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