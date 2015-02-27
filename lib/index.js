var async = require('async');
var _ = require('underscore');
var path = require('path');

module.exports = function(app){
	require('./modules')(app);
	require('./routes')(app);


}