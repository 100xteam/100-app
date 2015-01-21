
module.exports = function(app){

	app.param('location', function(req, res, next, id){
		console.log("Loading Location:" + id);
		return app.sdk.Location.findOne(id, function(err, location){
			console.log("Found Location:" + location.name);
			if(err) return next(err);
			res.bootstrap('location', location);
			return next();
		});
	});
}