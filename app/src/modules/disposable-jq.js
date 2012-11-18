(function ($, Disposable, undefined) {
  /**
   * Creates a jQuery object wrapper
   */
	var JQDisposable = function (elem, disposable) {
    this.elem = elem;
    this.disposable = disposable;
  }

  /**
   * Attaches events to the jQuery object
   * Returns itself for further chaining
   */
  JQDisposable.prototype.on = function (types, selector, data, fn) {
    // Later on dispose we need to unbind this event(s) with $.fn.off method,
    // wich doesn't accept data parameter, so we need to filter through arguments below.

    // Array of arguments to be passed to $.fn.off on dispose
    var args = [ types ];

    // Building array of arguments, filtering out the data param if present
    if (typeof types === "object") {
      if (typeof selector === "string") {
        args.push(selector);
      }
    } else if ( data == null && fn == null ) {
      args.push(selector);
    } else if (fn == null) {
      if ( typeof selector === "string" ) {
        args.push(selector);
      }
      args.push(data);
    } else {
      args.push(fn);
    }

    this.disposable._jQueries.push({
      context: this.elem,
      args: args
    });

    $.fn.on.apply(this.elem, arguments);

    return this;
  }

  /**
   * A jQuery object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  Disposable.prototype.jQuery = function (elem) {
    return new JQDisposable(elem, this);
  };

  /**
   * Register module
   */
	Disposable.mods.push({

		// Adds member properties
		constructor: function () {
			// jQuery events to be disposed
    	this._jQueries = [];
		},

		// Disposes all registered jQuery events
		dispose: function () {
			var host;

	    while (this._jQueries.length) {
	      host = this._jQueries.pop();
	      $.fn.off.apply(host.context, host.args);
	    }
  	}

	});

}(jQuery, jQuery.Disposable));