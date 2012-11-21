(function ($, BEM, ymaps, Disposable, undefined) {
  /**
   * Checks whether given object implements IEventManager interface
   */
  var isIEventManager = function (obj) {
    if (!isIEventManager.sample) {
      isIEventManager.sample = new ymaps.GeoObject().events;
    };

    return interfaceMatch(obj, isIEventManager.sample);
  },

  /**
   * Compares two objects by interface
   */
  interfaceMatch = function (obj1, obj2) {
    var match = true;

    for (var prop in obj1) {
      if (obj2[prop] === undefined) {
        match = false;
        break;
      }
    }

    return match;
  };

  /**
   * Alias function for attaching event callbacks
   */
  Disposable.prototype.on = function (elem) {
    if (this._disposed) return false;

    var rest = Array.prototype.slice.call(arguments, 1),
      wrap;

    // a jQuery object
    if (this.jQuery && elem instanceof $) {
      wrap = this.jQuery(elem);
      return wrap.on.apply(wrap, rest);
    }
    // a BEM block
    else if (this.BEM && elem instanceof BEM) {
      wrap = this.BEM(elem);
      return wrap.on.apply(wrap, rest);
    }
    // a ymaps object
    else if (this.ymaps && isIEventManager(elem.events)) {
      wrap = this.ymaps(elem);
      return wrap.on.apply(wrap, rest);
    }
  };

}(jQuery, BEM, ymaps, jQuery.Disposable));