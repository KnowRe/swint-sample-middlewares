'use strict';

var loader = require('./loader.js'),
	path = require('path');

module.exports = {
	loader: loader,
	middlewares: loader({
		dir: path.join(__dirname, './middlewares')
	})
};

