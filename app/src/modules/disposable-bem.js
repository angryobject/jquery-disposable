(function (Disposable, BEM, undefined) {
  /**
   * Creates a BEM block wrapper
   */
  var Class = function (elem, disposable) {
    this._elem = elem;
    this._disposable = disposable;
  };

  /**
   * Attaches events to the BEM block
   * Returns itself for further chaining
   */
  Class.prototype.on = function (e, fn, ctx, data) {
    this._disposable._bems.push({
      context: this._elem,
      // Will be passed to BEM.un on dispose
      args: [e, fn, ctx]
    });

    BEM.on.call(this._elem, e, data, fn, ctx);

    return this;
  };

  /**
   * A BEM block wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.bem = function (elem) {
    this._checkDisposable();

    return new Class(elem, this);
  };

  /**
   * Register module
   */
  Disposable.modules.push({

    // Adds member properties
    constructor: function () {
      // BEM events to be disposed
      this._bems = [];
    },

    // Disposes all registered BEM events
    dispose: function () {
      var host;

      while (this._bems.length) {
        host = this._bems.pop();
        BEM.un.apply(host.context, host.args);
      }
    }

  });

}(jQuery.Disposable, BEM));