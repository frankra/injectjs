module.exports = function(sPath){
	if (!sPath){
		//If nothing is provided, use the working directory as path;
		sPath = process.cwd();
	}
	//Load test dependencies
	const CORE_NAMESPACE = 'injectjs.core';

	var oUtils = require(__dirname + '/Utils.js')();
	oUtils.setObject(CORE_NAMESPACE + '.Utils', oUtils);

	var oImport = require(__dirname + '/Import.js')();
	oUtils.setObject(CORE_NAMESPACE + '.Import', oImport);

	//Setup Node dependency manager
	var fnNodeDependencyManager = require(__dirname + '/NodeDependencyManager.js');
	var oNodeDependencyManager = new fnNodeDependencyManager({
		path: sPath + '/node_dependencies.config.json'
	});
	oUtils.setObject(CORE_NAMESPACE + '.NodeDependencyManager', oNodeDependencyManager);

	//Start define
	var fnDefine = require(__dirname + '/define.js')(oNodeDependencyManager,oImport);
	oUtils.setObject('define', fnDefine);

	oImport.mapModulePath(CORE_NAMESPACE,'/src/core');
}
