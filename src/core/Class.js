module.exports = function(fnResolve){
	"use strict";

	function Class(){}

	Class.prototype.init = function() {};

	Class.extend = function(sNamespace,oPrototype){

		function fnClass(){
			this.init.apply(this,arguments);

		};

		fnClass.prototype = oPrototype;
		fnClass.prototype.constructor = fnClass;

		fnClass.extend = this.extend;

		for(var vAttribute in this.prototype){

			if(!oPrototype.hasOwnProperty(vAttribute)){
				fnClass.prototype[vAttribute] = this.prototype[vAttribute];
			}

		}
		var aSplittedNamespace = sNamespace.split('.');
		var oNavigator = global;
		for(var i = 0, ii = aSplittedNamespace.length - 1; i < ii; i++){
			if (oNavigator.hasOwnProperty(aSplittedNamespace[i])){
				oNavigator = oNavigator[aSplittedNamespace[i]];
			}else {
				oNavigator = (oNavigator[aSplittedNamespace[i]] = {});
			}

		}

		oNavigator[aSplittedNamespace[aSplittedNamespace.length - 1]] = fnClass;
	}
	global.Class = Class;
	fnResolve ? fnResolve(Class) : null;
}
