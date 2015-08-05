module.exports = function(fnResolve){
	"use strict";

	var oConstants = {};
	
	oConstants.URL_MONGO_DB = 'mongodb://localhost:27017/2stepauth';

	global.CONSTANTS = {};
	for (var sAttribute in oConstants){
		Object.defineProperty(CONSTANTS,sAttribute,{
			enumerable: false,
		    writable: false,
		    configurable: false,
		    value: oConstants[sAttribute]
		})
	};
   
	fnResolve(CONSTANTS);

}