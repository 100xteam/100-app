var async = require('async');
var _ = require('underscore');
module.exports = function(app){

	app.curatorMiddleware = [
		function(req, res, next){
			if(!req.user){
				return next();
			}
			if(!_.isUndefined(req.session.is_curator)){
				res.bootstrap('is_curator', req.session.is_curator);
				if(!req.is_curator){
					return next();
				}
				req.curated_locations = [];
				for(var i in req.session.curated_locations){
					req.curated_locations[i] = new app.sdk.Location(req.session.curated_locations[i]);
				}
				return next();
			}


			req.user.curated_locations(
				{ client_id: app.njax.config.core.app, client_secret:null },
				function(err, locations){
					if(err) return next(err);
					if(locations && locations.length > 0){
						req.session.is_curator = true;
						req.session.curated_locations = [];
						for(var i in locations){
							req.session.curated_locations[i] = {
								_id:locations[i]._id,
								name:locations[i].name,
								namespace:locations[i].namespace,
								url:locations[i].url,
								api_url:locations[i].api_url
							};
						}
						//console.log("Locations:", locations);
						res.bootstrap('curated_locations', locations);
					}else{
						req.session.is_curator = false;
					}
					res.bootstrap('is_curator', req.session.is_curator);
					return next();
				}
			);
		},
		function(req, res, next){
			if(!req.location){
				return next();
			}
			for(var i in req.curated_locations){
				if(req.curated_locations[i]._id == req.location._id){
					location_match = true;
				}
			}
			res.bootstrap('is_curator_of_current_location', location_match);
			return next();
		}


	];
}