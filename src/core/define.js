module.exports = function(NodeDependencyManager,Import){
	'use strict';

	return function(aDependencies,fnImplementation){
		var oInitializationPromise = null;
		var aModulePromises = [];

		for (var i = 0, ii = aDependencies.length; i < ii; i++){
			if (aDependencies[i].indexOf('$') === 0){
				aModulePromises.push(
					NodeDependencyManager.getDependency(aDependencies[i].replace('$','')) //remove $ from the name
				);
			}else {
				aModulePromises.push(
					Import.module(aDependencies[i])
				);
			}
		};
		//When all modules are loaded, then apply them on the implementation function
		Promise.all(aModulePromises).then(function(aModules){
			fnImplementation.apply(fnImplementation,aModules);
		}).catch(function(){
			console.log('Error while executing fnImplementation: ',arguments);
		});

	};
};
