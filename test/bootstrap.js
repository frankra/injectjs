module.exports = function(){
	var __base = process.cwd();
	//Load test dependencies
	require(__base + '/src/core/Core.js')(__dirname + '\\core');

	//Load test Framework
	global.chai = require('chai');
	global.chai.use(require('chai-spies'));
}
