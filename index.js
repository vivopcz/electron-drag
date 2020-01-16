var tryRequire = require('try-require');
var $ = require('dombo');

var electron = tryRequire('electron');
var remote = electron ? electron.remote : tryRequire('remote');

var mouseConstructor = tryRequire('osx-mouse') || tryRequire('win-mouse');

var supported = !!mouseConstructor;
var noop = function() {};
var mouse = mouseConstructor();

var drag = function(element) {
	element = $(element);

	var offset = null;

	var onmousedown = function(e) {
		offset = [e.clientX, e.clientY];
	};

	element.on('mousedown', onmousedown);

	mouse.on('left-drag', function(x, y) {
		if(!offset) return;

		x = Math.round(x - offset[0]);
		y = Math.round(y - offset[1]);

		remote.getCurrentWindow().setPosition(x, y);
	});

	mouse.on('left-up', function() {
		offset = null;
	});

	return function() {
		element.off('mousedown', onmousedown);
	};
};

var clear = function() {
	mouse.destroy();
};

drag.supported = supported;
module.exports = {
	drag: supported ? drag : noop,
	clear: supported ? clear : noop,
};
