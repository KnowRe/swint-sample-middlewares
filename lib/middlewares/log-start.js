'use strict';

module.exports = function() {
	return function(req, res, next) {
		req.log = {
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			protocol: req.protocol,
			host: req.hostname,
			url: req.url,
			userAgent: req.headers['user-agent'],
			input: req.input,
			sid: req.hasOwnProperty('cookies') ? req.cookies['connect.sid'] : '',
			timestamp: (new Date()).toISOString(),
			elapsed: 0,
			logTime: process.hrtime()
		};
		next();
	};
};
