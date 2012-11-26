(function (Disposable, undefined) {
  /**
   * Creates a ymaps object wrapper
   */
  var Class = function (events, disposable) {
    this._events = events;
    this._disposable = disposable;
  };

  /**
   * Attaches events to the ymaps object
   * Returns itself for further chaining
   */
  Class.prototype.on = function () {
    this._disposable._ymaps.push({
      context: this._events,
      args: arguments
    });

    this._events.add.apply(this._events, arguments);

    return this;
  };

  /**
   * A ymaps object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.ymaps = function (elem) {
    this._checkDisposable();

    return new Class(elem.events, this);
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

}(jQuery.Disposable));