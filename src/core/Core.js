
//Configure base
__base ? global.__base = 'c:/Users/i834660/GIT/2stepauth-web/' : null;

//Setup Node dependency manager
var fnNodeDependencyManager = require(__base + '/backend/src/foundation/core/NodeDependencyManager.js');
require(__base + '/backend/src/foundation/core/Import.js');
require(__base + '/backend/src/foundation/core/Utils.js')();
global.NodeDependencyManager = new fnNodeDependencyManager({
		path:'backend/src/foundation/core/NodeDependenciesMap.json'
	});
//Configure module path
Import.mapModulePath('backend','backend');

//Start define
global.define = require(__base + '/backend/src/foundation/core/define.js')(NodeDependencyManager,Import);