'use strict';

var swintHelper = require('swint-helper'),
	path = require('path'),
	serveFavicon = require('serve-favicon'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	defaultize({
		iconPath: path.join(__dirname, 'favicon.png')
	}, options);

	return serveFavicon(options.iconPath);
};
