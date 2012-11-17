(function ($, Disposable, undefined) {
	/**
   * A BEM block wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.BEM = function (elem) {
    var that = this;

    return {
      /**
       * Attaches events to the BEM block
       * Returns the BEM block
       */
      on : function (e, data, fn, ctx) {
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

        that._bems.push({
          context: elem,
          args: args
        });

        BEM.on.apply(elem, arguments);

        return elem;
      }
    };
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