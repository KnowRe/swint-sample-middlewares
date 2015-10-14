'use strict';

var swintHelper = require('swint-helper'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
		credentials: true
	}, options);

	return function(req, res, next) {
		var config = req.app.get('config');

		res.header('Access-Control-Allow-Origin', 'http://' + config.http.validHost[0]);
		res.header('Access-Control-Allow-Headers', options.headers.join(', '));
		res.header('Access-Control-Allow-Credentials', options.credentials.toString());
		next();
	};
};
