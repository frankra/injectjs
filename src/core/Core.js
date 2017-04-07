module.exports = function(sPath){
  "use strict";
  
  //If nothing is provided, use the working directory as path;
  sPath = sPath || process.cwd();
  
  //Load test dependencies
  var CORE_NAMESPACE = 'injectjs.core';

  var oUtils = require(__dirname + '/Utils.js')();
  oUtils.setObject(CORE_NAMESPACE + '.Utils', oUtils);

  var oImport = require(__dirname + '/Import.js')();
  oUtils.setObject(CORE_NAMESPACE + '.Import', oImport);

  //Start define
  var fnDefine = require(__dirname + '/define.js')(oImport);
  oUtils.setObject('define', fnDefine);

  oImport.mapModulePath('injectjs','/node_modules/node-injectjs/src');
};
