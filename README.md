#jQuery.Disposable

A jQuery helper plugin for disposing callback functions and detaching events.

##Purpose

$.Disposable allows you to easilly detach any events and "emptify" callback function by simply running one method, e.g.:

	var d = $.Disposable();

	// add a jQuery event listener
	d.jQuery(aJQueryObject).on('click', function clickHandler () {
	  // do something
	});
	
	// make an ajax request
	$.ajax('/some/url').done(d.callback(function dataParser () {
	  // parse data
	}));
	
	// calling the dispose method
	// makes attached event listeners to be of
	// and the done function to simply do nothint
	d.dispose();



##Usage

Plugin is packed with 4 modules:

- Callback module
- JQuery module
- BEM module
- Ymaps module

In the examples below suppose `d = $.Disposable()`.

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

### BEM module

The BEM module allows to attach events to BEM block just as for jQuery objects above.

**Usage:**

	d.BEM(aBemBlock).on('click', function () {
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