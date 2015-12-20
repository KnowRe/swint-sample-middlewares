'use strict';

var swintHelper = require('swint-helper'),
	crypto = require('crypto'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		headerPrefix: 'x-swint-',
		length: {
			key: 15,
			secret: 25
		},
		keys: [],
		salt: 'SwintIsForTwins'
	}, options);

	return function(req, res, next) {
		var key = req.headers[options.headerPrefix + 'key'],
			salt = options.salt,
			secret = req.headers[options.headerPrefix + 'secret'],
			shasum = crypto.createHash('sha256');

		shasum.update(key + salt);

		req.swintCheckHash = req.headers.hasOwnProperty(options.headerPrefix + 'key')
			&& req.headers.hasOwnProperty(options.headerPrefix + 'secret')
			&& (key.length === options.length.key)
			&& (secret.length === options.length.secret)
			&& (options.keys.indexOf(key) !== -1)
			&& (shasum.digest('base64').substring(0, options.length.secret) ===  secret);

		next();
	};
};
