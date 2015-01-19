
module.exports = function(app){

	app.param('location', function(req, res, next, id){
		return app.sdk.Location.findOne(id, function(err, location){
			if(err) return next(err);
			res.bootstrap('location', location);
			return next();
		});
	});
}