(function(){
	"use strict";

	/**
	* Node dependencies resolver. This module reads the configuration defined on the 'node_dependencies.config.json' file and resolve
	* the dependencies when required through the `define` api.
	* The node dependencies must to be defined with a `$` in front of it.
	* @example
	* // Given that the 'node_dependencies.config.json' looks like:
	* {
	*   "Express": {
	*     "name" : "express",
	*     "execute" : false
	*   },
	*   "App": {
	*	    "name" : "express",
	*	    "execute" : true
	*   },
	*   "HTTP": {
	*     "name" : "http",
	*     "execute" : true,
	*     "executionPath" : "Server",
	*     "executionArguments" : [{
	*       "alias" : "App"
	*     }]
	*   }
	* }
	* // Then the `define` syntax will look like:
	* module.exports = function(fnResolve){
	*   "use strict";
	*   define(['$App','$Express','$HTTP'],function(App, Express, HTTP){
	*     App.use(Express.static(process.cwd()));
	*
	*     var portNumber = 3000;
	*
	*     HTTP.listen(portNumber, function(){
	*       console.log('listening on localhost: ' + portNumber);
	*     });
	*
	*     fnResolve(App) //Resolve the promise once this module is ready.
	*   });
	* }
	* @class injectjs.core.NodeDependencyManager
	* @param {Object} mParameters
	*		The configuration object.
	*	@param {String} mParameters.path
	*		The path of where the NodeDependencyManager should look for the `node_dependencies.config.json` file
	*/
	function NodeDependencyManager(mParameters){
		if (!mParameters){
			throw new Error('Missing "mParameters" argument to initialize NodeDependencyManager');
		}
		//Init internal attributes
		this._oFS = require('fs');
		this._sFilePath = mParameters.path;
		this._mLoadedDependencies = {};
		this._mConfig = JSON.parse(
			this._oFS.readFileSync(mParameters.path, 'utf8')
		);

		return this;
	}
	/**
	* Returns the contents of the 'node_dependencies.config.json'
	* @return {Object} mConfig
	*		The configuration file contents.
	* @public
	* @memberOf injectjs.core.NodeDependencyManager
	*/
	NodeDependencyManager.prototype.getConfig = function(){
		return this._mConfig;
	};
	/**
	* Fetches the required node dependency by its alias.
	* The alias has to be defined on the 'node_dependencies.config.json' file.
	* @return {Promise} oModulePromise
	*		The Promise to be resolved once the module is loaded
	* @public
	* @memberOf injectjs.core.NodeDependencyManager
	*/
	NodeDependencyManager.prototype.getDependency = function(sAlias){
		if (this._mConfig.hasOwnProperty(sAlias)){
			return new Promise(injectjs.core.Utils.proxy(function(fnResolve){
				fnResolve(this._fetchDependencyByAlias(sAlias));
			},this));
		}else {
			throw new Error('Dependency with alias: "'+ sAlias +'" is not registered, please check dependency map on: ' + this._sFilePath);
		}
	};

	NodeDependencyManager.prototype._fetchDependencyByAlias = function(sAlias){

		if (!this._mLoadedDependencies.hasOwnProperty(sAlias)){
			var oDependencyConfig = this._mConfig[sAlias];
			var fnModule = this._requireModule(oDependencyConfig.name);

			if (oDependencyConfig.execute === true){
				var aLoadedArguments;

				if (oDependencyConfig.hasOwnProperty('executionArguments')){
					aLoadedArguments = this._loadRequiredArguments(oDependencyConfig.executionArguments);

				}
				if (oDependencyConfig.hasOwnProperty('executionPath')){
					this._mLoadedDependencies[sAlias] = fnModule[oDependencyConfig.executionPath].apply(this,aLoadedArguments);
				}else {
					this._mLoadedDependencies[sAlias] = fnModule.apply(this,aLoadedArguments);
				}

			} else {
				this._mLoadedDependencies[sAlias] = fnModule;
			}
		}
		return this._mLoadedDependencies[sAlias];
	};

	NodeDependencyManager.prototype._requireModule = function(sModuleName){
		return require(sModuleName); //Sync
	};

	 NodeDependencyManager.prototype._loadRequiredArguments = function(aRequiredArguments){
		var aLoadedArguments = [];

		for(var i = 0, ii = aRequiredArguments.length; i < ii; i++){
			aLoadedArguments.push(
				this._fetchDependencyByAlias(
					aRequiredArguments[i].alias
				)
			);
		}
		return aLoadedArguments;
	};

	module.exports = NodeDependencyManager;
}());
