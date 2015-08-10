
//Configure base
var sCurrentPath = __dirname;
global.__base = sCurrentPath.substr(0,sCurrentPath.lastIndexOf('\\')); //Navigate one folder up


require(__base + '/src/Import.js');
require(__base + '/src/Utils.js')();

//Setup Node dependency manager
var fnNodeDependencyManager = require(__base + '/src/NodeDependencyManager.js');
global.NodeDependencyManager = new fnNodeDependencyManager({
		path:'src/NodeDependenciesMap.json'
	});
//Configure module path
Import.mapModulePath('src','src');

//Start define
global.define = require(__base + '/src/define.js')(NodeDependencyManager,Import);
