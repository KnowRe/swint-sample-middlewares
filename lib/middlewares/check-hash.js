'use strict';

var swintHelper = require('swint-helper'),
	crypto = require('crypto'),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	options = defaultize({
		headerPrefix: 'X-Swint-',
		length: {
			key: 15,
			secret: 25
		},
		keys: [],
		salt: 'SwintIsForTwins'
	}, options);

	return function(req, res, next) {
		var key = req.headers[options.headerPrefix + 'Key'],
			salt = options.salt,
			secret = req.headers[options.headerPrefix + 'Secret'],
			shasum = crypto.createHash('sha256');

		shasum.update(key + salt);

		req.swintCheckHash = (key.length === options.length.key)
			&& (secret.length === options.length.secret)
			&& (options.keys.indexOf(key) !== -1)
			&& (shasum.digest('base64').substring(0, options.length.secret) ===  secret);

		next();
	};
};
