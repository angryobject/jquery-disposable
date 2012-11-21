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
    d.jQuery(jqObj).on('someEvt', {foo: 'bar'}, function (e) {
      data = e.data;
    });

    jqObj.trigger('click');
    jqObj.trigger('click');
    jqSubObj.trigger('mousedown');
    jqObj.trigger('someEvt');

    expect(callback.fn.calls.length).toEqual(3);
    expect(data.foo).toEqual('bar');

    d.jQuery(jqObj).on('someOtherEvt', 'span', {foo: 'baz'}, function (e) {
      data = e.data;
    });

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
    d.jQuery(jqObj).on('someEvt', {foo: 'bar'}, function (e) {
      data = e.data;
    });

    d.dispose();

    jqObj.trigger('click');
    jqObj.trigger('click');
    jqSubObj.trigger('mousedown');
    jqObj.trigger('someEvt');

    expect(callback.fn.calls.length).toEqual(0);
    expect(data).toEqual(undefined);

    d = jQuery.Disposable();

    d.jQuery(jqObj).on('someOtherEvt', 'span', {foo: 'baz'}, function (e) {
      data = e.data;
    });

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

  it('should not run after dispose', function () {
    var jqObj = $('<div>');

    d.dispose();
    expect(d.jQuery(jqObj)).toEqual(false);
  });

});