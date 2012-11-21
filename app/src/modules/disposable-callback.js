(function ($, Disposable, undefined) {
  /**
   * A callback function wrapper
   * Returns a new function that can be disposed
   */
  $.Disposable.prototype.callback = function (fn, ctx) {
    var that = this;

    return !this._disposed && function () {
      if (that._disposed) return;
      return fn.apply(ctx || this, arguments);
    }
  };

}(jQuery, jQuery.Disposable));