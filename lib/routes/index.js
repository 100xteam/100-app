
module.exports = function(app){

	app.param('location', function(req, res, next, id){
		console.log("Loading Location:" + id);
		return app.sdk.Location.findOne(id, function(err, location){
			if(err) return next(err);
			res.bootstrap('location', location);
			res.bootstrap('_location', location);
			return next();
		});
	});
}