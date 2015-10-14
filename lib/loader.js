'use strict';

var swintHelper = require('swint-helper'),
	path = require('path'),
	defaultize = swintHelper.defaultize,
	walk = swintHelper.walk;

module.exports = function(options) {
	defaultize({
		dir: path.dirname(require.main.filename),
		walkOption: {
			ext: 'js'
		}
	}, options);

	return load(options);
};

var load = function(options) {
	var walkOption = options.walkOption;
	walkOption.dir = options.dir;

	var walkList = walk(walkOption),
		ret = {};

	walkList.forEach(function(w) {
		var name = path.basename(w, '.js');

		ret[name] = require(w);
	});

	return ret;
};
