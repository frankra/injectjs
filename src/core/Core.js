module.exports = (mParams)=>{
  "use strict";

  //Setup
  let sDefineFunctionAlias = 'define';

  if (mParams){
    if (typeof mParams.defineFunctionAlias === "string"){
      sDefineFunctionAlias = mParams.defineFunctionAlias;
    }
  }

  //Initialize define API
  let oImport = require(__dirname + '/Import.js')();
  let fnDefine = require(__dirname + '/define.js')(oImport);
  //Namespace object
  let injectjs = {};
  //Map Injectjs core dependencies
  oImport.mapModulePath('injectjs','/node_modules/node-injectjs/src');
  //Set define API Globally - although is a bad practice, it is OK in this case because it improves the usability of this API later on
  global[sDefineFunctionAlias] = fnDefine;
  //set objects
  injectjs[sDefineFunctionAlias] = fnDefine;
  injectjs.core = {
    Import: oImport
  };
  //Return namespace obj so that userland can handle how to use this in their app
  return injectjs;
};
