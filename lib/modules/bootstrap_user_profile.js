var async = require('async');
var _ = require('underscore');
module.exports = function(app){
    app.bootstrapUserProfile = function(req, res, next){
        if(!req.user || !req.location){
            return next();
        }

		if(req.session.user_profile){
			res.bootstrap('user_profile', new app.sdk.Profile(req.session.user_profile));
			return next();
		}
		var query_url = '/' + req.user.namespace + '/profile/' + req.location.namespace;
        app.sdk.Profile.find({ uri : query_url }, function(err, profile) {
            if (err) { return next(err) }
            console.log("Profile: ", profile);
            if (profile) {
                profile.location = req.location;
                res.bootstrap('user_profile', profile);
				req.session.user_profile = profile.toObject();
            }
            return next();
        });
    };
}