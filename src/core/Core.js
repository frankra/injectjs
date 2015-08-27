module.exports = function(sPath){
	//Load test dependencies
	require(sPath + '/src/core/Utils.js')();

	require(sPath + '/src/core/Import.js');
		//Configure module path
	Import.mapModulePath('src.core','/src/core');

	//Setup Node dependency manager
	var fnNodeDependencyManager = require(sPath + '/src/core/NodeDependencyManager.js');
	global.NodeDependencyManager = new fnNodeDependencyManager({
		path: sPath + '/node_dependencies.config.json'
	});

	//Start define
	global.define = require(sPath + '/src/core/define.js')(NodeDependencyManager,Import);
}
