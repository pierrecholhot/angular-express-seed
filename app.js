
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  request = require('request');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', function(req, res){
  if(typeof(req.query._escaped_fragment_) !== "undefined") {
    var r = request({
      uri: 'http://localhost:3000/' + req.query._escaped_fragment_
    });
    r.pipe(res);
  }else{
    routes.index(req, res);
  }
});

app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

// http://fathomless-temple-9323.herokuapp.com/

// RewriteCond %{QUERY_STRING} ^_escaped_fragment_=(.*)$
// RewriteRule (.*) http://fathomless-temple-9323.herokuapp.com/%1? [P]

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
