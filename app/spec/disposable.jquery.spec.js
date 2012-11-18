describe('jQuery.Disposable', function() {
	var d;

	beforeEach(function() {
    d = jQuery.Disposable();
  });

	it('should return new instance without the "new" keyword', function () {
		var d = jQuery.Disposable();
		expect(d instanceof jQuery.Disposable).toEqual(true);
	});

	/**
   * Disposable.callback
   */
	describe('Callback module', function () {
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
	});

	/**
   * Disposable.jQuery
   */
	describe('jQuery module', function () {
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
	});

	/**
   * Disposable.BEM
   */
  describe('BEM module', function () {
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

			d.BEM(bemBlock).on('click', callback.fn);
			d.BEM(bemBlock).on('someEvt', {foo: 'bar'}, function (e) {
				data = e.data;
			});
			d.BEM(bemBlock).on('someOtherEvt', function (e) {
				ctx = this;
			}, {foo: 'bar'});

			bemBlock.trigger('click');
			bemBlock.trigger('click');
			bemBlock.trigger('someEvt');
			bemBlock.trigger('someOtherEvt');

			expect(callback.fn.calls.length).toEqual(2);
			expect(data.foo).toEqual('bar');
			expect(ctx.foo).toEqual('bar');

			d.BEM(bemBlock).on('someThirdEvt', {foo:'baz'}, function (e, d) {
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

			d.BEM(bemBlock).on('click', callback.fn);
			d.BEM(bemBlock).on('someEvt', {foo: 'bar'}, function (e) {
				data = e.data;
			});
			d.BEM(bemBlock).on('someOtherEvt', function (e) {
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

			d.BEM(bemBlock).on('someThirdEvt', {foo:'baz'}, function (e, d) {
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

      d.BEM(bemBlock).on('click', callback)
        .on('someEvt', callback);

      bemBlock.trigger('click').trigger('someEvt');

      expect(callback.calls.length).toEqual(2);

      d.dispose();

      bemBlock.trigger('click').trigger('someEvt');

      expect(callback.calls.length).toEqual(2);
    });
  });

	/**
   * Disposable.ymaps
   */
  describe('Ymaps module', function () {
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

			d.ymaps(ymapsObj).on('someThirdEvt', function (e) {
				data = e;
				ctx = this;
			}, {foo: 'qux'});

			d.dispose();

			ymapsObj.events.fire('someThirdEvt', {bar: 'baz'});

			expect(data).toEqual(undefined);
			expect(ctx).toEqual(undefined);
		});
  });

	/**
   * Disposable.on
   */
	describe('On helper module', function () {
		it('should be able to attach events to jQuery objects using "on" method', function () {
			var jqObj = $('<div>'),
				callback = {
					fn: function () {}
				};

			spyOn(callback, 'fn');
			spyOn(d, 'jQuery').andCallThrough();

	  	d.on(jqObj, 'click', callback.fn);

	  	jqObj.trigger('click');
	  	jqObj.trigger('click');

	  	expect(d.jQuery).toHaveBeenCalled();
			expect(callback.fn.calls.length).toEqual(2);
		});

		it('should be able to attach events to BEM blocks using "on" method', function () {
			var bemBlock,
				callback = {
					fn: function () {}
				};

			BEM.decl('block');
			bemBlock = BEM.create('block');

			spyOn(callback, 'fn');
			spyOn(d, 'BEM').andCallThrough();


			d.on(bemBlock, 'click', callback.fn);

			bemBlock.trigger('click');
			bemBlock.trigger('click');

			expect(d.BEM).toHaveBeenCalled();
			expect(callback.fn.calls.length).toEqual(2);
		});

		it('should be able to attach events to ymaps objects using "on" method', function () {
			var ymapsObj = new ymaps.GeoObject({
			  type: 'Point',
			  coordinates: [55.8, 37.8]
			}),
				callback = {
					fn: function () {}
				};

			spyOn(callback, 'fn');
			spyOn(d, 'ymaps').andCallThrough();

			d.on(ymapsObj, 'click', callback.fn);

			ymapsObj.events.fire('click');
			ymapsObj.events.fire('click');

			expect(d.ymaps).toHaveBeenCalled();
			expect(callback.fn.calls.length).toEqual(2);
		});
	});

});