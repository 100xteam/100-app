
module.exports = function(app){
	//require('./bootstrap_location')(app);
	//require('./stripe_middleware')(app);
    require('./bootstrap_user_profile')(app);
}