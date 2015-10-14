'use strict';

var swintHelper = require('swint-helper'),
	methodOverride = require('method-override'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		getter: 'X-HTTP-Method-Override',
		methods: ['POST']
	}, options);

	return methodOverride(options.getter, options);
};
