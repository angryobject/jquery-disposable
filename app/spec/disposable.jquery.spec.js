describe('jQuery.Disposable', function() {

  it('should return new instance without the "new" keyword', function () {
    var d = jQuery.Disposable();
    expect(d instanceof jQuery.Disposable).toEqual(true);
  });

});