/**
 * Disposable.on
 */
describe('On helper module', function () {

  var d;

  beforeEach(function() {
    d = jQuery.Disposable();
  });

  it('should be able to attach events to jQuery objects using "on" method and preserve chaining', function () {
    var jqObj = $('<div>'),
      callback = jasmine.createSpy('callback');

    spyOn(d, 'jQuery').andCallThrough();

    d.on(jqObj, 'click', callback).on('someEvt', callback);

    jqObj.trigger('click').trigger('someEvt');

    expect(d.jQuery).toHaveBeenCalled();
    expect(callback.calls.length).toEqual(2);

    d.dispose();

    jqObj.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should be able to attach events to BEM blocks using "on" method and preserve chaining', function () {
    var bemBlock,
      callback = jasmine.createSpy('callback');

    BEM.decl('block');
    bemBlock = BEM.create('block');

    spyOn(d, 'BEM').andCallThrough();

    d.on(bemBlock, 'click', callback).on('someEvt', callback);

    bemBlock.trigger('click').trigger('someEvt');

    expect(d.BEM).toHaveBeenCalled();
    expect(callback.calls.length).toEqual(2);

    d.dispose();

    bemBlock.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should be able to attach events to ymaps objects using "on" method and preserve chaining', function () {
    var ymapsObj = new ymaps.GeoObject({
      type: 'Point',
      coordinates: [55.8, 37.8]
    }),
      callback = jasmine.createSpy('callback');

    spyOn(d, 'ymaps').andCallThrough();

    d.on(ymapsObj, 'click', callback).on('someEvt', callback);

    ymapsObj.events.fire('click').fire('someEvt');

    expect(d.ymaps).toHaveBeenCalled();
    expect(callback.calls.length).toEqual(2);

    d.dispose();

    ymapsObj.events.fire('click').fire('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should not run after dispose', function () {
    var jqObj = $('<div>'),
      bemBlock,
      ymapsObj = new ymaps.GeoObject({
        type: 'Point',
        coordinates: [55.8, 37.8]
      }),
      callback = jasmine.createSpy('callback');

    BEM.decl('block');
    bemBlock = BEM.create('block');

    d.dispose();

    expect(d.on(jqObj, 'click', callback)).toEqual(false);
    expect(d.on(bemBlock, 'click', callback)).toEqual(false);
    expect(d.on(ymapsObj, 'click', callback)).toEqual(false);
  });

});