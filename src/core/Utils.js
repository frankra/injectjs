module.exports = function(fnResolve){
	"use strict";

	function Utils(){}

	Utils.prototype.proxy = function(fnToBeProxied,oProxyContext,aArguments){
		return function(){
			return fnToBeProxied.apply(oProxyContext,aArguments ? Array.prototype.slice.call(arguments).concat(aArguments) : arguments);
		};
	};
	Utils.prototype.setObject = function(sNamespace, fnConstructor){
		var aSplittedNamespace = sNamespace.split('.');
		var oNavigator = global;
		for(var i = 0, ii = aSplittedNamespace.length - 1; i < ii; i++){
			if (oNavigator.hasOwnProperty(aSplittedNamespace[i])){
				oNavigator = oNavigator[aSplittedNamespace[i]];
			}else {
				oNavigator = (oNavigator[aSplittedNamespace[i]] = {});
			}
		}
		//Set the constructor of the class to the last node of the namespace
		oNavigator[aSplittedNamespace[aSplittedNamespace.length - 1]] = fnConstructor;
	};

	var oUtils = new Utils();
	if(fnResolve){
		fnResolve(oUtils);
	}
	return oUtils;
};
