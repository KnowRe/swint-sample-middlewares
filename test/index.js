var assert = require('assert'),
	express = require('express'),
	http = require('http'),
	request = require('request'),
	swintMiddleware = require('../lib');

global.swintVar.printLevel = 5;

describe('Loader test', function() {
	it('Default loads', function() {
		var loaded = Object.keys(swintMiddleware.middlewares),
			middlewares = [
				'body-parser',
				'cookie-parser',
				'cors',
				'favicon',
				'log-end',
				'log-start',
				'method-override',
				'session',
				'swint-style-api'
			];

		middlewares.forEach(function(m) {
			assert.notEqual(loaded.indexOf(m), -1);

			if(swintMiddleware.middlewares[m].length === 3) {
				assert(true);
			} else if(swintMiddleware.middlewares[m].length <= 1) {
				assert.equal(swintMiddleware.middlewares[m]({}).length, 3);
			} else {
				assert(false);
			}
		});

		assert.equal(loaded.length, middlewares.length);
	});
});

describe('favicon', function() {
	var server;

	before(function() {
		var app = express();

		app.set('config', {
			http: {
				validHost: ['localhost']
			}
		});

		app.use(swintMiddleware.middlewares.favicon({}));

		app.get('/', function(req, res) {
			res.send('');
		});

		server = http.createServer(app);
		server.listen(8080);
	});

	it('Check favicon size', function(done) {
		request.get({
			url: 'http://localhost:8080/favicon.ico',
			followRedirect: false
		}, function(err, resp, body) {
			assert(resp.headers['content-length'], '837');
			done();
		});
	});

	after(function(done) {
		server.close(function() {
			done();
		});
	});
});

describe('CORS', function() {
	var server;

	before(function() {
		var app = express();

		app.set('config', {
			http: {
				validHost: ['localhost']
			}
		});

		app.use(swintMiddleware.middlewares.cors({
			allowedOrigins: ['http://localhost:8080', 'http://example.com']
		}));

		app.get('/', function(req, res) {
			res.send('');
		});

		server = http.createServer(app);
		server.listen(8080);
	});

	it('Check header', function(done) {
		request.get({
			url: 'http://localhost:8080/',
			followRedirect: false,
			headers: {
				origin: 'http://example.com'
			}
		}, function(err, resp, body) {
			assert.equal(resp.headers['access-control-allow-origin'], 'http://example.com');
			assert.equal(resp.headers['access-control-allow-headers'], 'Origin, X-Requested-With, Content-Type, Accept');
			assert.equal(resp.headers['access-control-allow-credentials'], 'true');
			done();
		});
	});

	after(function(done) {
		server.close(function() {
			done();
		});
	});
});

describe('logger', function() {
	var server,
		log;

	before(function() {
		var app = express();

		app.use(swintMiddleware.middlewares['log-start']());

		app.get('/', function(req, res, next) {
			res.send('');
			next();
		});

		app.use(swintMiddleware.middlewares['log-end']());

		app.use(function(req, res) {
			log = req.log;
		});

		server = http.createServer(app);
		server.listen(8080);
	});

	it('Check header', function(done) {
		request.get({
			url: 'http://localhost:8080/',
			followRedirect: false
		}, function(err, resp, body) {
			var logKeys = Object.keys(log),
				keys = [
					'ip',
					'protocol',
					'host',
					'url',
					'userAgent',
					'input',
					'sid',
					'timestamp',
					'elapsed',
					'logTime'
				];

			logKeys.forEach(function(k) {
				assert.notEqual(keys.indexOf(k), -1);
			});

			assert.equal(logKeys.length, keys.length);
			done();
		});
	});

	after(function(done) {
		server.close(function() {
			done();
		});
	});
});

describe('swint style api', function() {
	var server;

	before(function() {
		var app = express();

		app.use(swintMiddleware.middlewares['swint-style-api']);

		app.get('/', function(req, res, next) {
			req.out('foo', 'bar');
			req.success();
			next();
		});

		server = http.createServer(app);
		server.listen(8080);
	});

	it('Check header', function(done) {
		request.get({
			url: 'http://localhost:8080/',
			followRedirect: false
		}, function(err, resp, body) {
			assert.deepEqual(JSON.parse(body), {
				success: true,
				session: false,
				error: null,
				data: {
					foo: "bar"
				}
			});
			done();
		});
	});

	after(function(done) {
		server.close(function() {
			done();
		});
	});
});
