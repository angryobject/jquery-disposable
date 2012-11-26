/**
 * Disposable.jQuery
 */
describe('jQuery module', function () {

  var d;

  beforeEach(function() {
    d = jQuery.Disposable();
  });

  it('should be able to attach events to jQuery objects', function () {
    var jqObj = $('<div>'),
      jqSubObj = $('<span>').appendTo(jqObj),
      callback = {
        fn: function () {}
      },
      data;

    spyOn(callback, 'fn');

    d.jQuery(jqObj).on('click', callback.fn);
    d.jQuery(jqObj).on('mousedown', 'span', callback.fn);
    d.jQuery(jqObj).on('someEvt', function (e) {
      data = e.data;
    }, null, {foo: 'bar'});

    jqObj.trigger('click');
    jqObj.trigger('click');
    jqSubObj.trigger('mousedown');
    jqObj.trigger('someEvt');

    expect(callback.fn.calls.length).toEqual(3);
    expect(data.foo).toEqual('bar');

    d.jQuery(jqObj).on('someOtherEvt', 'span', function (e) {
      data = e.data;
    }, null, {foo: 'baz'});

    jqSubObj.trigger('someOtherEvt');

    expect(data.foo).toEqual('baz');
  });

  it('should be able to dispose registered jQuery events', function () {
    var jqObj = $('<div>'),
      jqSubObj = $('<span>').appendTo(jqObj),
      callback = {
        fn: function () {}
      },
      data;

    spyOn(callback, 'fn');

    d.jQuery(jqObj).on('click', callback.fn);
    d.jQuery(jqObj).on('mousedown', 'span', callback.fn);
    d.jQuery(jqObj).on('someEvt', function (e) {
      data = e.data;
    }, null, {foo: 'bar'});

    d.dispose();

    jqObj.trigger('click');
    jqObj.trigger('click');
    jqSubObj.trigger('mousedown');
    jqObj.trigger('someEvt');

    expect(callback.fn.calls.length).toEqual(0);
    expect(data).toEqual(undefined);

    d = jQuery.Disposable();

    d.jQuery(jqObj).on('someOtherEvt', 'span', function (e) {
      data = e.data;
    }, null, {foo: 'baz'});

    d.dispose();

    jqSubObj.trigger('someOtherEvt');

    expect(data).toEqual(undefined);
  });

  it('should allow chainable attaching of disposable events', function () {
    var jqObj = $('<div>'),
      callback = jasmine.createSpy('callback');

    d.jQuery(jqObj).on('click', callback)
      .on('someEvt', callback);

    jqObj.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);

    d.dispose();

    jqObj.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should accept a context for callback', function () {
    var jqObj = $('<div>'),
      ctx,
      callback = function () {
        ctx = this;
      };

    d.jQuery(jqObj).on('click', callback, {foo: 'bar'});

    jqObj.trigger('click');

    expect(ctx.foo).toEqual('bar');

    d.jQuery(jqObj).on({
      'click': callback,
      'someEvt': callback
    }, {foo: 'baz'});

    jqObj.trigger('click');

    expect(ctx.foo).toEqual('baz');

    ctx = undefined;

    jqObj.trigger('someEvt');

    expect(ctx.foo).toEqual('baz');
  });

  it('should not run after dispose and throw an error', function () {
    var jqObj = $('<div>');

    d.dispose();
    expect(function () {
      d.jQuery(jqObj)
    }).toThrow();
  });

  describe('.on method', function () {
    it('passes correct parameters to jQuery.fn.on', function () {
      var jqObj = $('<div>'),
        callback = jasmine.createSpy(),
        data = {foo:'bar'},
        ctx = {baz: 'qux'},
        evtMap = {
          click: callback,
          mousedown: callback
        };

      spyOn(jQuery.fn, 'on').andCallThrough();

      d.jQuery(jqObj).on('click', callback);
      expect(jQuery.fn.on).toHaveBeenCalledWith('click', undefined, undefined, callback);

      d.jQuery(jqObj).on('mousedown', 'span', callback);
      expect(jQuery.fn.on).toHaveBeenCalledWith('mousedown', 'span', undefined, callback);

      d.jQuery(jqObj).on('click', callback, null, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith('click', undefined, data, callback);

      d.jQuery(jqObj).on('mousedown', 'span', callback, null, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith('mousedown', 'span', data, callback);

      d.jQuery(jqObj).on(evtMap);
      expect(jQuery.fn.on).toHaveBeenCalledWith(evtMap, undefined, undefined, undefined);

      d.jQuery(jqObj).on(evtMap, 'span');
      expect(jQuery.fn.on).toHaveBeenCalledWith(evtMap, 'span', undefined, undefined);

      d.jQuery(jqObj).on(evtMap, null, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith(evtMap, undefined, data, undefined);

      d.jQuery(jqObj).on(evtMap, 'span', null, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith(evtMap, 'span', data, undefined);

      // same when context is supplied
      d.jQuery(jqObj).on('click', callback, ctx);
      expect(jQuery.fn.on).toHaveBeenCalledWith('click', undefined, undefined, callback);

      d.jQuery(jqObj).on('mousedown', 'span', callback, ctx);
      expect(jQuery.fn.on).toHaveBeenCalledWith('mousedown', 'span', undefined, callback);

      d.jQuery(jqObj).on('click', callback, ctx, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith('click', undefined, data, callback);

      d.jQuery(jqObj).on('mousedown', 'span', callback, ctx, data);
      expect(jQuery.fn.on).toHaveBeenCalledWith('mousedown', 'span', data, callback);
    });
  });

});