
module.exports = function(app){
	require('./modules')(app);
	require('./routes')(app);
}