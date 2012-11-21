(function ($, Disposable, undefined) {
  /**
   * Creates a ymaps object wrapper
   */
  var YmapsDisposable = function (elem, disposable) {
    this.elem = elem;
    this.disposable = disposable;
  };

  /**
   * Attaches events to the ymaps object
   * Returns itself for further chaining
   */
  YmapsDisposable.prototype.on = function (types, callback, context) {
    this.disposable._ymaps.push({
      context: this.elem.events,
      args: arguments
    });

    this.elem.events.add(types, callback, context);

    return this;
  };

  /**
   * A ymaps object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.ymaps = function (elem) {
    return !this._disposed && new YmapsDisposable(elem, this);
  };

  /**
   * Register module
   */
  Disposable.modules.push({

    // Adds member properties
    constructor: function () {
      // Ymaps events to be disposed
      this._ymaps = [];
    },

    // Disposes all registered ymaps events
    dispose: function () {
      var host;

      while (this._ymaps.length) {
        host = this._ymaps.pop();
        host.context.remove.apply(host.context, host.args);
      }
    }

  });

}(jQuery, jQuery.Disposable));