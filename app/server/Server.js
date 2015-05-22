var http = require('http');
var fs = require('fs');
var path = require('path');

var connect = require('connect'),
	compression = require('compression'),
	morgan = require('morgan'),
	serveStatic = require('serve-static'),
	timeout = require('connect-timeout');


var Server = function( ) {
};

var ServerProto = Server.prototype;

console.log('Executed as ' + (global.development ? 'development' : 'production') + ' environment');

ServerProto.init = function( ){
	this.setupStatics();
	this.setupTerminationHandlers();
};

ServerProto.setupStatics = function( ){
	global.statics = {
	};
};

ServerProto.setupTerminationHandlers = function(){
	var self = this;

	['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
	'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
	].forEach(function(element) {
		process.on(element, function() { console.log('%s: Node server stopped.', Date(Date.now()), element ); self.close(); });
	});
};

function setHeaders(res, path) {
	res.setHeader("Access-Control-Allow-Origin", "*");
}

ServerProto.buildUpConnect = function( ){
	var self = this;
	var app = connect()
		.use( morgan('dev') )
		.use( compression() )
		.use( timeout( 5000 ) )
		.use( serveStatic( path.join( global.codePath, 'www' ), { setHeaders: setHeaders } ) )
	;

	return app;
};

ServerProto.buildUpServer = function( ){
	var self = this;

	var app = self.buildUpConnect( );

	var port = global.config.NODEJS_PORT || global.config.PORT || global.config.server.port || 8080;
	var ipAddress = global.config.NODEJS_IP || global.config.IP || '0.0.0.0';

	var server = this.server = http.createServer( app );

	server.listen( port, ipAddress, function() {
		console.log('Running on http://'+ipAddress + ':' + port);
	});
};

ServerProto.serve = function( callback ){
	var self = this;

	self.buildUpServer( );

	if( callback ){
		callback();
	}
};

ServerProto.close = function( callback ){
	var self = this;

	if( this.server )
		this.server.close( function(){ self.server = null; console.log('HTTP stopped'); } );

	setTimeout(function(){
		if( self.server )
			process.exit( 1 );
	}, global.config.server.gracefulTimeout || 1000 );

	if( callback )
		callback();
};

module.exports = exports = Server;
