(function ($, Disposable, undefined) {
	/**
   * A ymaps object wrapper
   * Returns interface for attaching events to the wrapped object
   */
  $.Disposable.prototype.ymaps = function (elem) {
    var that = this;

    return {
      /**
       * Attaches events to the ymaps object
       * Returns the ymaps object
       */
      on: function (types, callback, context) {
        var args = [ types, callback ];

        if (context) args.push(context);

        that._ymaps.push({
          context: elem.events,
          args: args
        });

        elem.events.add(types, callback, context);

        return elem;
      }
    }
  };

  /**
   * Register module
   */
	Disposable.mods.push({

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

}(jQuery, jQuery.Disposable));