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
  $.Disposable.mods = [];

  /**
   * Adds member properties
   */
  $.Disposable.prototype.__constructor = function () {
    var that = this;

    // Call constructor in modules
    $.each($.Disposable.mods, function (i, mod) {
      mod.constructor && mod.constructor.call(that);
    });
  };

  /**
   * Disposes all registered callbacks and events
   */
  $.Disposable.prototype.dispose = function () {
    var that = this;

    // Call dispose in modules
    $.each($.Disposable.mods, function (i, mod) {
      mod.dispose && mod.dispose.call(that);
    });
  };

}(jQuery));
