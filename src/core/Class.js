module.exports = function(fnResolve){
	"use strict";

	function Class(){};

	Class.prototype.init = function(){};

	Class.extend = function(sNamespace,oPrototype){

		function fnClass(){
			if (!(this instanceof fnClass)){
				throw new Error("Constructor called as a function. You forgot the 'new' keyword.");
			}
			this.init.apply(this,arguments);
		};

		fnClass.prototype = oPrototype;
		fnClass.prototype.constructor = fnClass;

		fnClass.extend = this.extend;

		Object.keys(this.prototype).forEach(function(sAttribute){
			if(!oPrototype.hasOwnProperty(sAttribute)){
				fnClass.prototype[sAttribute] = this.prototype[sAttribute];
			}
		}.bind(this));
		var aSplittedNamespace = sNamespace.split('.');
		var oNavigator = global;
		for(var i = 0, ii = aSplittedNamespace.length - 1; i < ii; i++){
			if (oNavigator.hasOwnProperty(aSplittedNamespace[i])){
				oNavigator = oNavigator[aSplittedNamespace[i]];
			}else {
				oNavigator = (oNavigator[aSplittedNamespace[i]] = {});
			}
		};
		oNavigator[aSplittedNamespace[aSplittedNamespace.length - 1]] = fnClass;
	}

	global.Class = Class;
	fnResolve ? fnResolve(Class) : null;
}
