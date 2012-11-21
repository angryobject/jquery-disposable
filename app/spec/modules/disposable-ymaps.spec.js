/**
 * Disposable.ymaps
 */
describe('Ymaps module', function () {

  var d;

  beforeEach(function() {
    d = jQuery.Disposable();
  });

  it('should be able to attach events to ymaps objects', function () {
    var ymapsObj = new ymaps.GeoObject({
      type: 'Point',
      coordinates: [55.8, 37.8]
    }),
      callback = {
        fn: function () {}
      },
      data,
      ctx;

    spyOn(callback, 'fn');

    d.ymaps(ymapsObj).on('click', callback.fn);
    d.ymaps(ymapsObj).on('someEvt', function (e) {
      data = e;
    });
    d.ymaps(ymapsObj).on('someOtherEvt', function (e) {
      ctx = this;
    }, {foo: 'bar'});

    ymapsObj.events.fire('click');
    ymapsObj.events.fire('click');
    ymapsObj.events.fire('someEvt', {foo: 'baz'});
    ymapsObj.events.fire('someOtherEvt');

    expect(callback.fn.calls.length).toEqual(2);
    expect(data.originalEvent.foo).toEqual('baz');
    expect(ctx.foo).toEqual('bar');

    d.ymaps(ymapsObj).on('someThirdEvt', function (e) {
      data = e;
      ctx = this;
    }, {foo: 'qux'});

    ymapsObj.events.fire('someThirdEvt', {bar: 'baz'});

    expect(data.originalEvent.bar).toEqual('baz');
    expect(ctx.foo).toEqual('qux');
  });

  it('should be able to dispose registered ymaps events', function () {
    var ymapsObj = new ymaps.GeoObject({
      type: 'Point',
      coordinates: [55.8, 37.8]
    }),
      callback = {
        fn: function () {}
      },
      data,
      ctx;

    spyOn(callback, 'fn');

    d.ymaps(ymapsObj).on('click', callback.fn);
    d.ymaps(ymapsObj).on('someEvt', function (e) {
      data = e;
    });
    d.ymaps(ymapsObj).on('someOtherEvt', function (e) {
      ctx = this;
    }, {foo: 'bar'});

    d.dispose();

    ymapsObj.events.fire('click');
    ymapsObj.events.fire('click');
    ymapsObj.events.fire('someEvt', {foo: 'baz'});
    ymapsObj.events.fire('someOtherEvt');

    expect(callback.fn.calls.length).toEqual(0);
    expect(data).toEqual(undefined);
    expect(ctx).toEqual(undefined);

    d = jQuery.Disposable();

    d.ymaps(ymapsObj).on('someThirdEvt', function (e) {
      data = e;
      ctx = this;
    }, {foo: 'qux'});

    d.dispose();

    ymapsObj.events.fire('someThirdEvt', {bar: 'baz'});

    expect(data).toEqual(undefined);
    expect(ctx).toEqual(undefined);
  });

  it('should allow chainable attaching of disposable events', function () {
    var ymapsObj = new ymaps.GeoObject({
      type: 'Point',
      coordinates: [55.8, 37.8]
    }),
      callback = jasmine.createSpy('callback');

    d.ymaps(ymapsObj).on('click', callback).on('someEvt', callback);

    ymapsObj.events.fire('click').fire('someEvt');

    expect(callback.calls.length).toEqual(2);

    d.dispose();

    ymapsObj.events.fire('click').fire('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should not run after dispose', function () {
    var ymapsObj = new ymaps.GeoObject({
      type: 'Point',
      coordinates: [55.8, 37.8]
    });

    d.dispose();
    expect(d.ymaps(ymapsObj)).toEqual(false);
  });

});