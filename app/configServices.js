var _ = require('lodash');

module.exports = {
	conf: {},
	env: ()=> {
		_.merge( this.conf, process.env );
		return this;
	},
	argv: ()=> {
		_.merge( this.conf, require('minimist')(process.argv.slice(2)) );
		return this;
	},
	file: files => {
		var self = this;
		(files||[]).forEach( function( file ){
			_.merge( self.conf, require( file ) );
		} );
		return self;
	},
	all: files => {
		return this.env().argv().file( files );
	},
	config: ()=> {
		return this.conf;
	}
};
