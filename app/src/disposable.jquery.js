(function ($, undefined) {
  /**
   * Creates a new Disposable helper object
   */
  var Class = $.Disposable = function () {
    if ( !(this instanceof $.Disposable) )  {
      return new $.Disposable();
    }

    this.__constructor();
  },

  prt = Class.prototype;

  // Contains information about modules
  Class.modules = [];

  /**
   * Adds member properties
   */
  prt.__constructor = function () {
    var that = this;

    this._disposed = false;

    // Call constructor in modules
    $.each(Class.modules, function (i, module) {
      module.constructor && module.constructor.call(that);
    });
  };

  /**
   * Disposes all registered callbacks and events
   */
  prt.dispose = function () {
    var that = this;

    this._disposed = true;

    // Call dispose in modules
    $.each(Class.modules, function (i, module) {
      module.dispose && module.dispose.call(that);
    });
  };

  /**
   * Whether the current instance is disposed
   */
  prt.isDisposed = function () {
    return this._disposed;
  };

  /**
   * Check if instance is disposed
   * and throw error if so
   */
  prt._checkDisposable = function () {
    if (this.isDisposed()) {
      throw new Error('Disposable object can be used only once.');
    }
  };

}(jQuery));
