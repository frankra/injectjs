module.exports = function(done){
  let __base = process.cwd();
  //Load test dependencies
  let injectjs = require(__base + '/src/core/Core.js')(__dirname + '/core');
  //Map
  injectjs.core.Import.mapModulePath('injectjs','/src');
  //Load test Framework
  global.chai = require('chai');
  global.chai.use(require('chai-spies'));

  
  
}
