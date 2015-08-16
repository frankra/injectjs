
var __base = require('../BaseDir.js');
//Load test dependencies
require(__base + '/src/Utils.js')();

require(__base + '/src/Import.js');
	//Configure module path
Import.mapModulePath('src','/src');

//Setup Node dependency manager
var fnNodeDependencyManager = require(__base + '/src/NodeDependencyManager.js');
	global.NodeDependencyManager = new fnNodeDependencyManager({
			path:'src/NodeDependenciesMap.json'
		});

//Start define
global.define = require(__base + '/src/define.js')(NodeDependencyManager,Import);

//Load test Framework
global.chai = require('chai');
global.chai.use(require('chai-spies'));
