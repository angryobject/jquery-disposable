describe('jQuery.Disposable', function() {
	var d;

	beforeEach(function() {
    d = jQuery.Disposable();
  });

	it('should return new instance without the "new" keyword', function () {
		var d = jQuery.Disposable();
		expect(d instanceof jQuery.Disposable).toEqual(true);
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

	it('should be able to attach events to jQuery objects using "on" method', function () {
		var jqObj = $('<div>'),
			callback = {
				fn: function () {}
			};

		spyOn(callback, 'fn');
		spyOn(d, 'jQuery').andCallThrough();

  	d.jQuery(jqObj).on('click', callback.fn);

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


		d.BEM(bemBlock).on('click', callback.fn);

		bemBlock.trigger('click');
		bemBlock.trigger('click');

		expect(d.BEM).toHaveBeenCalled();
		expect(callback.fn.calls.length).toEqual(2);
	});

	describe('Experimental functionality', function () {
		it('should be able to make ajax requests', function () {
			var ajax,
				ajaxFail,
				done = jasmine.createSpy('done'),
				fail = jasmine.createSpy('fail'),
				always = jasmine.createSpy('always');

			runs(function () {
				ajax = d.ajax('/spec/fixtures/ajax.json').done(done).fail(fail).always(always);
				ajaxFail = d.ajax('/spec/fixtures/404.json').done(done).fail(fail).always(always);
			});

			waitsFor(function () {
				return ajax.status === 200 && ajaxFail.status === 404;
			}, 700);

			runs(function () {
				expect(done.calls.length).toEqual(1);
				expect(fail.calls.length).toEqual(1);
				expect(always.calls.length).toEqual(2);
			});
		});

		it('should be able to dispose registered ajax requests', function () {
			var done = jasmine.createSpy('done'),
				fail = jasmine.createSpy('fail'),
				always = jasmine.createSpy('always'),
				ajax = d.ajax('/spec/fixtures/ajax.json').done(done).fail(fail).always(always);

			spyOn(ajax, 'abort').andCallThrough();

			d.dispose();

			expect(ajax.abort).toHaveBeenCalled();

			expect(done.calls.length).toEqual(0);
			expect(fail.calls.length).toEqual(1);
			expect(always.calls.length).toEqual(1);
		});
	});
});

