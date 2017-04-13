module.exports = function(){
  "use strict";
  //Initialize define API
  let oImport = require(__dirname + '/Import.js')();
  let fnDefine = require(__dirname + '/define.js')(oImport);
  //Map Injectjs core dependencies
  oImport.mapModulePath('injectjs','/node_modules/node-injectjs/src');
  //Set define API Globally
  global.define = fnDefine;
  
  return { //defines injectjs.define and injectjs.core.Import
    define: fnDefine,
    core: {
      Import: oImport
    }
  };
};
