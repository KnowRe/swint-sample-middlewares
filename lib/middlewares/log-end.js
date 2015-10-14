'use strict';

module.exports = function(req, res, next) {
	var diff = process.hrtime(req.log.logTime);

	req.log.logTime = undefined;
	req.log.elapsed = diff[0] * 1e9 + diff[1];

	print(2, JSON.stringify(req.log));

	next();
};
