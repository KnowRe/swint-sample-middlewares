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
				'check-hash',
				'cookie-parser',
				'cors',
				'favicon',
				'jwt',
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

describe('CORS II', function() {
	var server;

	before(function() {
		var app = express();

		app.set('config', {
			http: {
				validHost: ['localhost']
			}
		});

		app.use(swintMiddleware.middlewares.cors({
			allowedOrigins: ['*']
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

		app.use(swintMiddleware.middlewares['log-start']());
		app.use(swintMiddleware.middlewares['swint-style-api']);

		app.get('/', function(req, res, next) {
			req.out('foo', 'bar');
			req.success();
			next();
		});

		app.use(swintMiddleware.middlewares['log-end']());

		server = http.createServer(app);
		server.listen(8080);
	});

	it('Check header', function(done) {
		request.get({
			url: 'http://localhost:8080/?input=' + JSON.stringify({
				pass: 'foo1',
				key: 'bar1',
				lv1: {
					pwd: 'foo2',
					secret: 'bar2',
					lv2: {
						pw: 'foo3',
						lv3: {
							password: 'foo4'
						}
					}
				}
			}),
			followRedirect: false
		}, function(err, resp, body) {
			assert.deepEqual(JSON.parse(body), {
				success: true,
				session: false,
				error: null,
				token: false,
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

describe('check-hash', function() {
	it('basic success', function(done) {
		var checkHash = swintMiddleware.middlewares['check-hash'],
			checkHashFunc = checkHash({
				keys: ['C7tO1ClvR/Gz7jJ']
			}),
			req = {
				headers: {
					'x-swint-key': 'C7tO1ClvR/Gz7jJ',
					'x-swint-secret': 'cEVEf3Ka3XwijpAH2vMYdD98x'
				}
			};

		checkHashFunc(req, {}, function() {
			assert(req.swintCheckHash);
			done();
		});
	});

	it('key length fail', function(done) {
		var checkHash = swintMiddleware.middlewares['check-hash'],
			checkHashFunc = checkHash({
				keys: ['C7tO1ClvR/Gz7j']
			}),
			req = {
				headers: {
					'x-swint-key': 'C7tO1ClvR/Gz7j',
					'x-swint-secret': 'cEVEf3Ka3XwijpAH2vMYdD98x'
				}
			};

		checkHashFunc(req, {}, function() {
			assert(!req.swintCheckHash);
			done();
		});
	});

	it('key fail', function(done) {
		var checkHash = swintMiddleware.middlewares['check-hash'],
			checkHashFunc = checkHash({
				keys: []
			}),
			req = {
				headers: {
					'x-swint-key': 'C7tO1ClvR/Gz7jJ',
					'x-swint-secret': 'cEVEf3Ka3XwijpAH2vMYdD98x'
				}
			};

		checkHashFunc(req, {}, function() {
			assert(!req.swintCheckHash);
			done();
		});
	});

	it('secret fail', function(done) {
		var checkHash = swintMiddleware.middlewares['check-hash'],
			checkHashFunc = checkHash({
				keys: []
			}),
			req = {
				headers: {
					'x-swint-key': 'C7tO1ClvR/Gz7jJ',
					'x-swint-secret': 'cEVEf3Ka3XwijpAH2vMYdD98y'
				}
			};

		checkHashFunc(req, {}, function() {
			assert(!req.swintCheckHash);
			done();
		});
	});
});

describe('jwt', function() {
	it('jwt basic', function(done) {
		var jwt = require('jsonwebtoken'),
			token = jwt.sign({ foo: 'bar' }, 'SwintIsForTwins', { expiresIn: '1d' });
			jwtMid = swintMiddleware.middlewares['jwt'],
			jwtFunc = jwtMid({}),
			req = {
				headers: {
					authorization: 'Bearer ' + token
				},
				output: {}
			};

		jwtFunc(req, {}, function() {
			assert(req.output.token);
			done();
		});
	});
});
