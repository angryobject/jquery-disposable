/**
 * Disposable.BEM
 */
describe('BEM module', function () {

  var d;

  beforeEach(function() {
    d = jQuery.Disposable();
  });

  it('should be able to attach events to BEM blocks', function () {
    var bemBlock,
      callback = {
        fn: function () {}
      },
      data,
      ctx;

    BEM.decl('block');
    bemBlock = BEM.create('block');

    spyOn(callback, 'fn');

    d.bem(bemBlock).on('click', callback.fn);
    d.bem(bemBlock).on('someEvt', {foo: 'bar'}, function (e) {
      data = e.data;
    });
    d.bem(bemBlock).on('someOtherEvt', function (e) {
      ctx = this;
    }, {foo: 'bar'});

    bemBlock.trigger('click');
    bemBlock.trigger('click');
    bemBlock.trigger('someEvt');
    bemBlock.trigger('someOtherEvt');

    expect(callback.fn.calls.length).toEqual(2);
    expect(data.foo).toEqual('bar');
    expect(ctx.foo).toEqual('bar');

    d.bem(bemBlock).on('someThirdEvt', {foo:'baz'}, function (e, d) {
      data = e.data;
      ctx = this;
    }, {foo: 'qux'});

    bemBlock.trigger('someThirdEvt', {foo: 'foo'});

    expect(data.foo).toEqual('baz');
    expect(ctx.foo).toEqual('qux');
  });

  it('should be able to dispose registered BEM events', function () {
    var bemBlock,
      callback = {
        fn: function () {}
      },
      data,
      ctx;

    BEM.decl('block');
    bemBlock = BEM.create('block');

    spyOn(callback, 'fn');

    d.bem(bemBlock).on('click', callback.fn);
    d.bem(bemBlock).on('someEvt', {foo: 'bar'}, function (e) {
      data = e.data;
    });
    d.bem(bemBlock).on('someOtherEvt', function (e) {
      ctx = this;
    }, {foo: 'bar'});

    d.dispose();

    bemBlock.trigger('click');
    bemBlock.trigger('click');
    bemBlock.trigger('someEvt');
    bemBlock.trigger('someOtherEvt');

    expect(callback.fn.calls.length).toEqual(0);
    expect(data).toEqual(undefined);
    expect(ctx).toEqual(undefined);

    d = jQuery.Disposable();

    d.bem(bemBlock).on('someThirdEvt', {foo:'baz'}, function (e, d) {
      data = e.data;
      ctx = this;
    }, {foo: 'qux'});

    d.dispose();

    bemBlock.trigger('someThirdEvt', {foo: 'foo'});

    expect(data).toEqual(undefined);
    expect(ctx).toEqual(undefined);
  });

  it('should allow chainable attaching of disposable events', function () {
    var bemBlock,
      callback = jasmine.createSpy('callback');

    BEM.decl('block');
    bemBlock = BEM.create('block');

    d.bem(bemBlock).on('click', callback)
      .on('someEvt', callback);

    bemBlock.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);

    d.dispose();

    bemBlock.trigger('click').trigger('someEvt');

    expect(callback.calls.length).toEqual(2);
  });

  it('should not run after dispose and throw an error', function () {
    var bemBlock;

    BEM.decl('block');
    bemBlock = BEM.create('block');

    d.dispose();
    expect(function () {
      d.bem(bemBlock)
    }).toThrow();
  });

});