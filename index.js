//var async = require('async');
var _ = require('underscore');
module.exports = function(config){
	var njax = require('njax-app');
	var app = njax(config);
	app.sdk = require('100-sdk')(_.clone(config));
	require('./lib')(app);

	if(!app.njax){
		app.njax = {};
	}
	app.njax.broadcast = function(users, event, data, callback){
		if(!callback) {
			callback = function () {};
		}
		app.sdk.trigger(users, event, data, callback);
	}
	app.locals.partials._navbar = '_navbar';
	app.locals.partials._meta = '_meta';
	app.locals.partials._meta_angular = '_meta_angular';

	var _start = _.bind(app.start, app);
	app.start = _.bind(function(cb){
		//app.njax.addTemplateDir(path.join(__dirname, 'public', 'templates'));
		_start(cb);
	}, app);
	return app;
}