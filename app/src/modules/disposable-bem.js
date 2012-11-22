(function (Disposable, BEM, undefined) {
  /**
   * Creates a BEM block wrapper
   */
  var Class = function (elem, disposable) {
    this.elem = elem;
    this.disposable = disposable;
  };

  /**
   * Attaches events to the BEM block
   * Returns itself for further chaining
   */
  Class.prototype.on = function (e, data, fn, ctx) {
    // Later on dispose we need to unbind this event(s) with BEM.un method,
    // wich doesn't accept data parameter, so we need to filter through arguments below.

    // Array of arguments to be passed to BEM.un on dispose
    var args = [].concat(arguments[0],
      Array.prototype.slice.call(arguments, typeof arguments[1] === 'object' ? 2 : 1));

    this.disposable._bems.push({
      context: this.elem,
      args: args
    });

    BEM.on.apply(this.elem, arguments);

    return this;
  };

  /**
   * A BEM block wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.BEM = function (elem) {
    return !this._disposed && new Class(elem, this);
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