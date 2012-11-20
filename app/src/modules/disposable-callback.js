(function ($, Disposable, undefined) {
  /**
   * A callback function wrapper
   * Returns a new function that can be disposed
   */
  $.Disposable.prototype.callback = function (fn, ctx) {
    var host = {
      isDisposed: false,
      callback: function () {
        if (host.isDisposed) return;
        return fn.apply(ctx ? ctx : this, arguments);
      }
    };

    this._callbacks.push(host);

    return host.callback;
  };

  /**
   * Register module
   */
  Disposable.modules.push({

    // Adds member properties
    constructor: function () {
      // Callback functions to be disposed
      this._callbacks = [];
    },

    // Disposes all registered callbacks
    dispose: function () {
      var host;

      while (this._callbacks.length) {
        this._callbacks.pop().isDisposed = true;
      }
    }

  });

}(jQuery, jQuery.Disposable));