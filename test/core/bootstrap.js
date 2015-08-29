module.exports = function(){
	var __base = require('../../BaseDir.js');
	//Load test dependencies
	require(__base + '/src/core/Core.js')(__dirname);

	//Load test Framework
	global.chai = require('chai');
	global.chai.use(require('chai-spies'));
}
