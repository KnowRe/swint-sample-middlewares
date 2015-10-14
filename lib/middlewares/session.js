'use strict';

var swintHelper = require('swint-helper'),
	expressSession = require('express-session'),
	RedisStore = require('connect-redis')(expressSession),
	defaultize = swintHelper.defaultize;

module.exports = function(options) {
	defaultize({
		mode: 'cookie',
		secret: 'SwintIsForTwins',
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 3600000 * 24,
			domain: false
		},
		rolling: true,
		resave: true,
		saveUninitialized: true
	}, options);

	switch(options.mode) {
		case 'cookie':
			return expressSession(options);
		case 'redis':
			options.store = new RedisStore(options.redis);
			return expressSession(options);
	}
};
