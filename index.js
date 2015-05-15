//var async = require('async');
var _ = require('underscore');
var path = require('path');

module.exports = app100 = {
	middleware:function(app){
		return [
			function(req, res, next){
				res.render100 = function(_main_partial, locals){
					if(res.locals.iframe_url){
						//console.log("Overwriting:" + _main_partial + ' for _iframe');
						_main_partial = '_iframe';

					}
					if(!res.locals.partials){
						res.locals.partials = _.extend(app.locals.partials);
					}
					res.locals.partials._main_partial = _main_partial;

					if(locals && locals.focus){
						res.locals.focus = (locals.focus.toObject && locals.focus.toObject({ light: true })) || locals.focus;
						delete(locals.focus);
					}else{
						if(res.locals.focus){
							//Do nothing were cool
						}else if(locals) {

							res.locals.focus = (locals.toObject && locals.toObject({ light: true })) || locals;
						}else if(req._location || req.location){
							var location = (req._location || req.location);
							res.locals.focus = location.toObject({ light: true });
						}else{
							console.error("There is no focus object...");
						}
					}

					var location = req.location || req._location;
					res.locals.sub_focus = location && (location.toObject && location.toObject({ dark: true })) || location || null;
					if(!res.locals.sub_focus || (location && location.namespace == res.locals.focus.namespace && res.locals.focus._njax_type == 'Location')){
						//They are the same so use the 'global' namespace
						res.locals.sub_focus = app.njax.cache.default_location.toObject({ dark: true  });

					}
					if(res.locals.focus._njax_type == 'Location') {
						res.locals._hide_sub_focus_title = true;
					}
					if(res.locals.focus && res.locals.focus.location_friendly_url){
						res.locals.focus.url = res.locals.focus.location_friendly_url;
					}
					if(res.locals.sub_focus && res.locals.sub_focus.location_friendly_url){
						res.locals.sub_focus.url = res.locals.sub_focus.location_friendly_url;
					}
					var tab_ct = 0;
					var primary_tabs = [];
					var secondary_tabs = [];
					for(var i in req.tabs){

						if(tab_ct < 5) {
							primary_tabs.push(req.tabs[i]);
						}else{

							secondary_tabs.push(req.tabs[i]);
						}
						tab_ct += 1;
					}
					res.bootstrap('primary_tabs', primary_tabs);
					if(secondary_tabs.length > 0) {
						res.bootstrap('has_secondary_tabs', true);
						res.bootstrap('secondary_tabs', secondary_tabs);
					}

					//IF iframe url
					return res.render('basic_view', locals);
				}
				res.addTab = function(namespace, name, url, action){
					switch(action){
						case('relative_link'):
						case('absolute_link'):
						case('tab'):
						break;
						default:
							throw new Error("Invalid tab action: " + action)
					}
					var tab = {
						namespace:namespace,
						tab_name:name,
						url:url,
						action:action
					}
					tab['is_' + action] = true;
					if(!req.tabs){
						req.tabs = [];
					}
					req.tabs.push(tab);
					return tab;
				}
				res.setFocus = function(focus, sub_focus){
					if(!_.isUndefined(focus) && !_.isNull(focus)){
						if(focus.toObject){
							res.bootstrap('focus', focus);
						}else{
							res.locals.focus = focus;
						}
					}
					if(!_.isUndefined(sub_focus) && !_.isNull(sub_focus)){
						if(sub_focus.toObject){
							res.bootstrap('sub_focus', sub_focus);
						}else{
							res.locals.sub_focus = sub_focus;
						}
					}
				}
				return next();
			}

		]
	},

	init:function(config){


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
		app.locals.partials._core_meta = '_core_meta';
		app.use(app100.middleware(app));
		var _start = _.bind(app.start, app);

		app.njax.addTemplateDir(path.join(__dirname, 'public', 'templates'));
		app.start = _.bind(function(cb){
			app.njax.cache('default_location', function(cb){
				return app.sdk.Location.findOne('default_location', function(err, location){
					if(err) return cb(err);
console.log('Default Location:', location);
					return cb(null, location);
				});
			}, [/*'100innovation.location.create', '100innovation.location.update'*/], function(err){
				if(err) throw err;
			});
			_start(cb);
		}, app);
		return app;
	}
}