//var async = require('async');
var _ = require('underscore');
var path = require('path');

module.exports = function(config){
	var njax = require('njax-app');
	var app = njax(config);

	app.njax.sdk_constructor =  require('100-sdk');
	app.sdk = app.njax.sdk_constructor(_.clone(config));

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
	app.njax.addTemplateDir(path.join(__dirname, 'public', 'templates'));
	app.start = _.bind(function(cb){
		//
		_start(cb);
	}, app);
	return app;
}