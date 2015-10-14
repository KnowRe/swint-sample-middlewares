'use strict';

var swintHelper = require('swint-helper'),
	bodyParser = require('body-parser'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		type: 'json'
	}, options);

	return bodyParser[options.type](options);
};
