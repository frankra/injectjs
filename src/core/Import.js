module.exports = function(fnResolve){
	"use strict";
	/**
	* Import module resolver
	* @class Import
	*/
	function Import(){
		this._mPathTree = {};
		this._base = process.cwd();
	};
	/**
	* Maps the given sAlias to the given sPhysicalPath.
	* Example: Import.mapModulePath('my.test.module.path','/src/files');
	* @param {String} sAlias
	*		Name of the alias to be defined, splitted by dots '.'
	* @param {String} sPhysicalPath
	*		The actual physical path where the files are located, or at least part of it
	* @return {this} Import
	*		To allow chain usage
	* @public
	*/
	Import.prototype.mapModulePath = function(sAlias,sPhysicalPath){
		var aAliasParts = sAlias.split('.');
		this._setRegisterFromAlias(this._mPathTree,aAliasParts,sAlias,sPhysicalPath);
		return this;
	};

	Import.prototype._setRegisterFromAlias = function(oNavigator,aAliasParts,sAlias,sPhysicalPath){
		var sPart = aAliasParts.splice(0,1)[0];
		if (sPart){
			if (!oNavigator.hasOwnProperty(sPart)){
				oNavigator = oNavigator[sPart] = {};
			}else {
				oNavigator = oNavigator[sPart];
			}
			//Recursion can cause Stack-overflow errors. JS don't support tail calculation
			//TODO: ES6 will improve tail calculation \o/
			this._setRegisterFromAlias(oNavigator,aAliasParts,sAlias,sPhysicalPath);
		}else {
			oNavigator.path = sPhysicalPath
			oNavigator.alias = sAlias;
		};
	};

	Import.prototype._getRegisterFromAlias = function(oNavigator,aAliasParts){
		var sPart = aAliasParts.splice(0,1)[0];
		if (sPart && oNavigator.hasOwnProperty(sPart)){
			oNavigator = oNavigator[sPart];
			return this._getRegisterFromAlias(oNavigator,aAliasParts);
		}else if (oNavigator.hasOwnProperty('alias')){
			return oNavigator;
		}else {
			throw new Error('Import.prototype._getRegisterFromAlias: Attribute "path" not found.' + sAliasParts.join('.'));
		}
	};
	Import.prototype._assembleRequirePath = function(sRequiredAlias,bAddJSSuffix){
		var oRegister = this._getRegisterFromAlias(this._mPathTree,sRequiredAlias.split('.'));

		var sAliasReplaced = sRequiredAlias.replace(oRegister.alias,oRegister.path);

		var sAssembledRequirePath = this._prepareRequirePath(sAliasReplaced,bAddJSSuffix);

		return sAssembledRequirePath;
	};

	Import.prototype._prepareRequirePath = function(sPath,bAddJSSuffix){
		var sDotsReplaced = sPath.replace(/\./gi,'/'); //Regex: Replace dots with slashes '.'>'/'

		var sWithJSSuffix = bAddJSSuffix ? sDotsReplaced.concat('.js') : sDotsReplaced;
		var sWithBasePrefix = this._base + sWithJSSuffix;
		return sWithBasePrefix
	}
	/**
	* Requires the module defined by the given Alias, so when requiring
	* custom dependencies only the Alias or at least part of it needs to be provided.
	* Given that you maped:
	* 		Import.mapModulePath('my.test.alias','src/files');
	* When you import:
	*		Import.module('my.test.alias.with.my.test.Object');
	* Then you actually require:
	*		<basepath>/src/files/with/my/test/Object.js
	* > Note that '/with/my/test/' path was automatically resolved, since it was not specified.
	* > Note that by default a '.js' will be appended by the end of the required depency.
	* @param {String} sRequiredAlias
	*	The alias to be resolved into the physical path and be required as a module
	* @return {Promise} Promise
	*	The promise that will be resolved once the module is loaded
	*/
	Import.prototype.module = function(sRequiredAlias){
		return new Promise(injectjs.core.Utils.proxy(function(fnResolve,fnReject){
			this._require(
				this._assembleRequirePath(sRequiredAlias,true),
				fnResolve
			);
		},this));
	};
	//I wrapped this one because I wanted to test the 'require' calls...
	Import.prototype._require = function(sRequirePath,fnResolve){
		return require(sRequirePath)(fnResolve);
	};

	var oImport = new Import();
	fnResolve && fnResolve(oImport);
	return oImport;
}
