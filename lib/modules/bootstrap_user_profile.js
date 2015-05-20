var async = require('async');
var _ = require('underscore');
module.exports = function(app){
    app.bootstrapUserProfile = function(req, res, next){
        if(!req.user || !req.location){
            return next();
        }

		if(req.session.user_profile || req.session.default_user_profile){
			res.bootstrap('user_profile', new app.sdk.Profile(req.session.user_profile || req.session.default_user_profile));
            res.bootstrap('default_user_profile', req.user_profile);
			return next();
		}
		var query_url = '/' + req.user.namespace + '/profile/' + req.location.namespace;
        return app.sdk.Profile.find({ uri : query_url }, function(err, profile) {
            if (err) { return next(err) }
            console.log("Profile: ", profile);
            if (profile) {
                profile.location = req.location;
                res.bootstrap('user_profile', profile);
                res.bootstrap('default_user_profile', profile);
				req.session.user_profile = profile.toObject();
            }
            return next();
        });
    };

    /*app.use(function(req, res, next){
        if(!req.user){
            return next();//This can happen
        }

        var query = {
            $and:[
                {
                    //location:req._location._id,
                    owner:req.user._id
                },
                { $or: [
                    { archiveDate: { $gt: new Date() } },
                    { archiveDate: null }
                ] }
            ]

        }
        //console.log(query);
        app.model.Profile.find(query).populate('location').exec(function(err, profiles){
            if(err) return next(err);
            res.bootstrap('user_profiles', profiles);
            if(req._location){
                for(var i in profiles){

                    //This is the old way
                    if (profiles[i].location && profiles[i].location.equals(req._location)) {
                        res.bootstrap('user_profile', profiles[i]);
                    }

                }
            }

            if(req.user.default_profile) {
                for(var i in profiles){
                    //console.log('default_profile:', profiles[i]._id, req.user.default_profile);

                    if (profiles[i]._id.equals(req.user.default_profile)) {
                        res.bootstrap('default_user_profile', profiles[i]);
                    }
                }
            }


            return next();
        });
    });*/
}