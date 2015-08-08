module.exports = function(fnResolve){
	"use strict";

	var oConstants = {};



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
