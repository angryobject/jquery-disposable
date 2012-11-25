#jQuery.Disposable

A jQuery helper plugin for disposing callback functions and detaching events.

##Purpose

$.Disposable allows you to easilly detach any events and "emptify" callback function by simply running one method, e.g.:

	var d = $.Disposable();

	// add a jQuery event listener
	d.jQuery(aJQueryObject).on('click', function () {
	  // do something
	});

	// make an ajax request
	$.ajax('/some/url').done(d.callback(function () {
	  // parse data
	}));

	// calling the dispose method
	// makes attached event listeners to be of
	// and the done function to simply do nothing
	d.dispose();

##Usage

Plugin is packed with 4 modules:

- Callback module
- JQuery module
- BEM module
- Ymaps module

In the examples below suppose `d = $.Disposable()`.

Note, that the disposable object is ment to be used once. After you call the `dispose` method - you can't use it any more, and if you do - you'll get an error:
	
	d.dispose();
	
	// will throw an error
	var fn = d.callback(function () {		
	});

###Callback module

The Callback module allows to create a disposable function, that can change it's behavior based upon the status of the $.Disposable object, i.e. when the object is disposed - the function will do nothing.

**Usage:**

	var fn = d.callback(function () {
		// do something
	});

	fn(); // does something

	d.dispose();

	fn(); // does nothing

Also, you can pass the context, in which the function should be executed, as the second parameter to `d.callback`:

	d.callback(function () {
		// do something
	}, aContext);

### jQuery module

The jQuery module allows to attach events to a jQuery objects and be able to turn them off all at once.

**Usage:**

	d.jQUery(aJQueryObject).on('click', function () {
		// do something on click
	}).on('customEvt', function () {
		// do something on custom event
	});

	aJQueryObject.trigger('click'); // does something
	aJQueryObject.trigger('customEvt'); // does something

	d.dispose();

	// The event handlers were detached.
	aJQueryObject.trigger('click'); // does nothing
	aJQueryObject.trigger('customEvt'); // does nothing

The `on` method supports all parameters that jQuery does.

Also, you cat pass context for the callback as the last parameter:

	d.jQUery(aJQueryObject).on('click', function () {
		console.log(this); // {foo: 'bar'}
	}, {foo: 'bar'});

Note, that you can't use the context argument when passing a map of types/handlers as the first parameter.

### BEM module

The BEM module allows to attach events to BEM block just as for jQuery objects above.

**Usage:**

	d.bem(aBemBlock).on('click', function () {
		// do something on click
	}).on('customEvt', function () {
		// do something on custom event
	});

	aBemBlock.trigger('click'); // does something
	aBemBlock.trigger('customEvt'); // does something

	d.dispose();

	// The event handlers were detached.
	aBemBlock.trigger('click'); // does nothing
	aBemBlock.trigger('customEvt'); // does nothing

The `on` method supports all parameters that BEM does.

### Ymaps module

The Ymaps module allows to attach events to ymaps objects, again, just as for jQuery objects and BEM blocks.

**Usage:**

	d.ymaps(aYmapsObject).on('click', function () {
		// do something on click
	}).on('customEvt', function () {
		// do something on custom event
	});

	aYmapsObject.events.fire('click'); // does something
	aYmapsObject.events.fire('customEvt'); // does something

	d.dispose();

	// The event handlers were detached.
	aYmapsObject.events.fire('click'); // does nothing
	aYmapsObject.events.fire('customEvt'); // does nothing

The `on` method supports all parameters that Ymaps does.
