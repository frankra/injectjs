module.exports = function(){
	var __base = require('../../BaseDir.js');
	//Load test dependencies
	require(__base + '/src/core/Utils.js')();

	require(__base + '/src/core/Import.js');
		//Configure module path
	Import.mapModulePath('src.core','/src.core');

	//Setup Node dependency manager
	var fnNodeDependencyManager = require(__base + '/src/core/NodeDependencyManager.js');
		global.NodeDependencyManager = new fnNodeDependencyManager({
				path:'test/core/TESTNodeDependenciesMap.json'
			});

	//Start define
	global.define = require(__base + '/src/core/define.js')(NodeDependencyManager,Import);

	//Load test Framework
	global.chai = require('chai');
	global.chai.use(require('chai-spies'));
}
