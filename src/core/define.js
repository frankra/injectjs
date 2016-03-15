module.exports = function(NodeDependencyManager,Import){
	'use strict';
	/**
	* Define a new function which can be a new module or Class.
	* @param {String[]} aDependencies
	*		An array of the dependnecies that should be provided to the scope of the fnImplementation function.
	*		These can be either files on the system, which are accessible through their namespace, or Node modules,
	*		that are defined on the node_dependencies.config.json file, the latest should be prefixed with a $dollarSign.
	*@param {function} fnImplementation
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
		};
		//When all modules are loaded, apply them on the implementation function
		Promise.all(aModulePromises).then(function(aModules){
			fnImplementation.apply(fnImplementation,aModules);
		}).catch(function(){
			//This should be handled properly...
			console.log('Error while executing callback from define API: ',arguments);
		});
	};
	return define;
};
