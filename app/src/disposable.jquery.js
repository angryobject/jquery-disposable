(function ($, undefined) {
  /**
   * Creates a new Disposable helper object
   */
  $.Disposable = function () {
    if ( !(this instanceof $.Disposable) )  {
      return new $.Disposable();
    }

    this.__constructor();
  };

  // Contains information about modules
  $.Disposable.modules = [];

  /**
   * Adds member properties
   */
  $.Disposable.prototype.__constructor = function () {
    var that = this;

    this._disposed = false;

    // Call constructor in modules
    $.each($.Disposable.modules, function (i, module) {
      module.constructor && module.constructor.call(that);
    });
  };

  /**
   * Disposes all registered callbacks and events
   */
  $.Disposable.prototype.dispose = function () {
    var that = this;

    this._disposed = true;

    // Call dispose in modules
    $.each($.Disposable.modules, function (i, module) {
      module.dispose && module.dispose.call(that);
    });
  };

  /**
   * Whether the current instance is disposed
   */
  $.Disposable.prototype.isDisposed = function () {
    return this._disposed;
  };

}(jQuery));
