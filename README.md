# swint-middleware

[![Greenkeeper badge](https://badges.greenkeeper.io/Knowre-Dev/swint-middleware.svg)](https://greenkeeper.io/)
Essential expressJS middlewares and general middleware loader for Swint

**Warning: This is not the final draft yet, so do not use this until its official version is launched**

## Installation
```sh
$ npm install --save swint-middleware
```

## Loader
### Options
* `dir` : `String`, default: `path.dirname(require.main.filename)`
* `walkOption` : `Object`, default: `{ ext: 'js' }`

### Usage
```javascript
var middlewares = loader({
	dir: path.join(__dirname, 'middlewares')
}); // { middlewareA: [Function], middlewareB: [Function], ... }
```

## Middlewares
### Usage
```javascript
app.use(myMiddleware(options));
```

* `myMiddleware()` (not `myMiddleware` itself) gets three arguments, which is `req`, `res`, `next`.
