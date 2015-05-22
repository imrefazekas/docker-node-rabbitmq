var path = require('path');
global.codePath = __dirname ? path.join(__dirname, '/../') : process.cwd();

var configs = [
	path.join( global.codePath, 'server/config/server' )
];
global.config = require('../configServices').env().argv().file( configs ).config();

var Server = require('./Server');
var server = new Server( );

server.init();
server.serve();
