(function(){
	"use strict"

	function NodeDependencyManager(mParameters){
		if (!mParameters){
			throw new Error('Missing mParameters argument to initialize NodeDependencyManager.');
		}
		//Init internal attributes
		this._oFS = require('fs');
		this._sFilePath = mParameters.path;
		this._mLoadedDependencies = {};
		this._mConfig = JSON.parse(
			this._oFS.readFileSync(mParameters.path, 'utf8')
		);

		return this;
	};

	NodeDependencyManager.prototype.getConfig = function(){
		return this._mConfig;
	};

	NodeDependencyManager.prototype.getDependency = function(sAlias){
		if (this._mConfig.hasOwnProperty(sAlias)){
			return new Promise(Utils.proxy(function(fnResolve,fnReject){
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
			)
		}
		return aLoadedArguments;
	}

	module.exports = NodeDependencyManager;

}());
