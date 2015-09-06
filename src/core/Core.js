module.exports = function(sPath){
	//Load test dependencies
	require(__dirname + '/Utils.js')();

	require(__dirname + '/Import.js');
		//Configure module path
	Import.mapModulePath('injectjs.core','/src/core');

	//Setup Node dependency manager
	var fnNodeDependencyManager = require(__dirname + '/NodeDependencyManager.js');
	global.NodeDependencyManager = new fnNodeDependencyManager({
		path: sPath + '/node_dependencies.config.json'
	});

	//Start define
	global.define = require(__dirname + '/define.js')(NodeDependencyManager,Import);
}
