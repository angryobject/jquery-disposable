/**
 * Disposable.callback
 */
describe('Callback module', function () {

  var d;

  beforeEach(function() {
    d = jQuery.Disposable();
  });

  it('should be able to wrap a callback function', function () {
    var callback = {
      fn: function () {
        return 2;
      }
    },
      dCallback;

    spyOn(callback, 'fn').andCallThrough();

    dCallback = d.callback(callback.fn);

    expect(dCallback()).toEqual(2);
    expect(callback.fn).toHaveBeenCalled();
  });

  it('should be able to bind a callback function to context', function () {
    var callback = {
      fn: function () {
        return this.prop;
      },
      prop: 2
    },
      dCallback;

    spyOn(callback, 'fn').andCallThrough();

    dCallback = d.callback(callback.fn, callback);

    expect(dCallback()).toEqual(callback.prop);
    expect(callback.fn).toHaveBeenCalled();

    expect(dCallback.apply({
      prop:5
    })).toEqual(2);
  });

  it('should dispose registered callbacks', function () {
    var callback = {
      fn: function () {
        return 2;
      }
    },
      dCallback;

    spyOn(callback, 'fn').andCallThrough();

    dCallback = d.callback(callback.fn);
    d.dispose();

    expect(callback.fn).not.toHaveBeenCalled();
    expect(dCallback()).toEqual(undefined);
  });

  it('should not run after dispose', function () {
    d.dispose();
    expect(d.callback(function () {})).toEqual(false);
  });

});