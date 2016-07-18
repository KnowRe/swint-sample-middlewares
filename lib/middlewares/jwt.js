'use strict';

var sHelper = require('swint-helper'),
	defaultize = sHelper.defaultize,
	jwt = require('jsonwebtoken');

module.exports = function(options) {
	options = defaultize({
		tokenSecret: 'SwintIsForTwins'
	}, options);

	return function(req, res, next) {
		if (!req.headers.hasOwnProperty('authorization')) {
			req.output.token = false;
			next();
			return;
		}

		var token = req.headers.authorization.split('Bearer ')[1];

		if (!token) {
			req.output.token = false;
			next();
			return;
		}

		try {
			req.tokenInfo = jwt.verify(token, options.tokenSecret);
			req.output.token = true;
		} catch (err) {
			req.tokenInfo = {};
			req.output.token = false;
		} finally {
			next();
		}
	};
};
