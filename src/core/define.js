module.exports = function(NodeDependencyManager,Import){
  'use strict';

  /**
  * @function define
  * @description Syntax used to define a new module using the Dependency Injection engine from Node InjectJS framework.
  * @example
  * //The 'fnResolve' function is injected in all modules required by the InjectJS framework.
  * //It should be called when your module is ready to be consumed.
  * module.exports = function(fnResolve){
  *   "use strict";
  *   define(['app.src.models.User','app.src.core.security.Authentication'],function(User, Authentication){
  *     //This function will only load once both User and Authentication are also loaded, including their dependencies.
  *     function MyFunction(){};
  *
  *     MyFunction.prototype.myMethod = function(){...do something};
  *
  *     fnResolve(MyFunction) //Resolve the promise once this module is ready.
  *   });
  * }
  * @param {String[]} aDependencies
  *		An array of the dependencies that should be provided to the scope of the fnImplementation function.
  *		These can be either files on the system, which are accessible through their namespace, or Node modules,
  *		that are defined on the node_dependencies.config.json file, the latest should be prefixed with a $dollarSign.
  * @param {function} fnImplementation
  *		The callback function to be called when all required dependencies are resolved.
  */
  function define(aDependencies,fnImplementation){
    var aModulePromises = [];
    //Fetch all requird dependencies
    for (var i = 0, ii = aDependencies.length; i < ii; i++){
      if (aDependencies[i].indexOf('$') === 0){ //Node dependency, should be mapped on node_dependencies.config.json
        aModulePromises.push(
          NodeDependencyManager.getDependency(aDependencies[i].replace('$','')) //remove $ from the name
        );
      }else { //Custom dependency, should have its path maped through the Import.mapModulePath API
        aModulePromises.push(
          Import.module(aDependencies[i])
        );
      }
    }
    //When all modules are loaded, apply them on the implementation function
    Promise.all(aModulePromises).then(function(aModules){
      fnImplementation.apply(fnImplementation,aModules);
    }).catch(function(e){
      //This should be handled properly...
      console.log('Error while executing callback from define API: ',e.stack);
    });
  }
  return define;
};
