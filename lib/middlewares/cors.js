'use strict';

var swintHelper = require('swint-helper'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
		allowedOrigins: ['http://localhost'],
		credentials: true
	}, options);

	return function(req, res, next) {
		if(options.allowedOrigins.indexOf(req.headers.origin) !== -1) {
			res.header('Access-Control-Allow-Origin', req.headers.origin);
		}
		res.header('Access-Control-Allow-Headers', options.headers.join(', '));
		res.header('Access-Control-Allow-Credentials', options.credentials.toString());
		next();
	};
};
