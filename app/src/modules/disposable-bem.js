(function ($, Disposable, undefined) {
  /**
   * Creates a BEM block wrapper
   */
	var BEMDisposable = function (elem, disposable) {
    this.elem = elem;
    this.disposable = disposable;
  }

  /**
   * Attaches events to the BEM block
   * Returns the BEM block
   */
  BEMDisposable.prototype.on = function (e, data, fn, ctx) {
    // Later on dispose we need to unbind this event(s) with BEM.un method,
    // wich doesn't accept data parameter, so we need to filter through arguments below.

    // Array of arguments to be passed to BEM.un on dispose
    var args = [ e ];

    // Building array of arguments, filtering out the data param if present
    if (fn == null && ctx == null) {
      args.push(data);
    } else if (ctx == null) {
      if ($.isFunction(fn)) {
        args.push(fn)
      } else {
        args.push(data);
        args.push(fn);
      }
    } else {
      args.push(fn);
      args.push(ctx);
    }

    this.disposable._bems.push({
      context: this.elem,
      args: args
    });

    BEM.on.apply(this.elem, arguments);

    return this.elem;
  }

  /**
   * A BEM block wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.BEM = function (elem) {
    return new BEMDisposable(elem, this);
  };

	/**
   * Register module
   */
	Disposable.mods.push({

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

}(jQuery, jQuery.Disposable));