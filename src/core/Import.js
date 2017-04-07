module.exports = function(fnResolve){
  "use strict";
  /**
  * Import module resolver. Resolves the custom javascript modules that are defined using the InjectJS Module definition pattern.
  * @class injectjs.core.Import
  */
  function Import(){
    this._mPathTree = {};
    this._base = process.cwd();
    this._mCachedPromises = {};
  }
  /**
  * Maps the given sAlias to the given sPhysicalPath.
  * Example: Import.mapModulePath('my.test.module.path','/src/files');
  * @param {String} sAlias
  *		Name of the alias to be defined, splitted by dots '.'
  * @param {String} sPhysicalPath
  *		The actual physical path where the files are located, or at least part of it
  * @return {injectjs.core.Import} this
  *		The current instance to allow method chaining
  * @public
  * @memberOf injectjs.core.Import
  */
  Import.prototype.mapModulePath = function(sAlias,sPhysicalPath){
    var aAliasParts = sAlias.split('.');
    this._setRegisterFromAlias(this._mPathTree,aAliasParts,sAlias,sPhysicalPath);
    return this;
  };

  /**
  * Injects the given module into the cache using the alias as key.
  * @param {String} sAlias
  *		Name of the alias to be defined, splitted by dots '.'
  * @param {Anything} oModule
  *		The module to be cached. Can be anything, but ideally should be an Object, or a Promise.
  * @return {injectjs.core.Import} this
  *		The current instance to allow method chaining
  * @public
  * @memberOf injectjs.core.Import
  */
  Import.prototype.setModule = function(sAlias, vModule){
    if (vModule instanceof Promise){
      this._cacheModulePromise(sAlias, vModule);
    }else {
      this._cacheModulePromise(sAlias,
        new Promise(function(fnResolve){
          fnResolve(vModule);
        })
      );
    }

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
      this._setRegisterFromAlias(oNavigator,aAliasParts,sAlias,sPhysicalPath);
    }else {
      oNavigator.path = sPhysicalPath;
      oNavigator.alias = sAlias;
    }
  };
  //Recursive Function
  Import.prototype._getRegisterFromAlias = function(oNavigator,aAliasParts,oLastValidNode,sOriginalAlias){
    var sPart = aAliasParts.splice(0,1)[0];
    if (oNavigator.path){
      oLastValidNode = oNavigator;
    }

    if (sPart && oNavigator.hasOwnProperty(sPart)){
      oNavigator = oNavigator[sPart];
      return this._getRegisterFromAlias(oNavigator,aAliasParts,oLastValidNode,sOriginalAlias);
    }else if (oNavigator.hasOwnProperty('alias')){
      return oNavigator;
    }else if (oLastValidNode && oLastValidNode.path){
      return oLastValidNode;
    }else {
      throw new Error("Attribute 'path' not found on node with alias segment: " + sPart + " on alias: " + sOriginalAlias);
    }
  };

  Import.prototype._assembleRequirePath = function(sRequiredAlias,bAddJSSuffix){
    var oRegister = this._getRegisterFromAlias(this._mPathTree,sRequiredAlias.split('.'),null,sRequiredAlias);

    var sAliasReplaced = sRequiredAlias.replace(oRegister.alias,oRegister.path);

    var sAssembledRequirePath = this._prepareRequirePath(sAliasReplaced,bAddJSSuffix);

    return sAssembledRequirePath;
  };

  Import.prototype._prepareRequirePath = function(sPath,bAddJSSuffix){
    var sDotsReplaced = sPath.replace(/\./gi,'/'); //Regex: Replace dots with slashes '.'>'/'

    var sWithJSSuffix = bAddJSSuffix ? sDotsReplaced.concat('.js') : sDotsReplaced;
    var sWithBasePrefix = this._base + sWithJSSuffix;
    return sWithBasePrefix;
  };

  Import.prototype._cacheModulePromise = function(sKey, oModulePromise){
    this._mCachedPromises[sKey] = oModulePromise;
  };
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
  * @memberOf injectjs.core.Import
  */
  Import.prototype.module = function(sRequiredAlias){
    if (!this._mCachedPromises.hasOwnProperty(sRequiredAlias)){
      var iTimeoutID = setTimeout(function(){
        console.log('Dependency taking too long to load: ', sRequiredAlias);
      },2000); //TODO: Make this configurable

      var oPromise = new Promise(function(fnResolve){
        require(this._assembleRequirePath(sRequiredAlias,true))(fnResolve);
      }.bind(this));

      oPromise.then(function(oModule){
        clearTimeout(iTimeoutID);

        return oModule;
      }).catch(function(oError){
        console.error(//This should be handled properly.
          'Error while loading module: ' + sRequiredAlias,
          'Original Error Message: ' + oError.message,
          oError.stack
        );
      });

      this._cacheModulePromise(sRequiredAlias, oPromise);
    }

    return this._mCachedPromises[sRequiredAlias];
  };
  /**
  *	Returns the Absolute path of the module mapped to the given alias, if existent
  * @param {String} sAlias
  * The alias to be used to resolve the Absolute path. e.g.: 'app.src.services'
  * @return {String}
  * The absolute path mapped by the given alias. e.g.: '/app/src/main/services'
  * @memberOf injectjs.core.Import
  */
  Import.prototype.getAbsolutePath = function(sAlias){
    return this._assembleRequirePath(sAlias,false);
  };

  var oImport;
  if (injectjs && injectjs.core && injectjs.core.Import){
    oImport = injectjs.core.Import;

  }else {
    oImport = new Import();
  }

  if (fnResolve){
    fnResolve(oImport);
  }
  return oImport;
};
