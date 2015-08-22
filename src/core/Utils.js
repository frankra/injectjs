module.exports = function(fnResolve){
	"use strict";

	function Utils(){};

	Utils.prototype.proxy = function(fnToBeProxied,oProxyContext,aArguments){
		return function(){
			return fnToBeProxied.apply(oProxyContext,aArguments ? Array.prototype.slice.call(arguments).concat(aArguments) : arguments);
		}
	},

	global.Utils = new Utils();

	fnResolve && fnResolve(global.Utils);
};
