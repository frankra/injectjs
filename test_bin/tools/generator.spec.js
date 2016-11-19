require('../bootstrap.js');
var oFS = require('fs');
var sNode_DependencyConfigPath = (process.cwd() + '/node_dependencies.config.json');

function deleteGeneratedFile(){
  try {
    oFS.unlinkSync(sNode_DependencyConfigPath);
  } catch(e){ //May fail if the file is not there...
    console.log(e)
  }
}
function getGeneratedFile(fnCallback){
  try {
    oFS.readFile(sNode_DependencyConfigPath,fnCallback);
    return true;
  } catch(e){
    console.log(e);
    return false;
  }
}

describe("bin.tools.generator - Functionality",function(){
  it("Should generate the 'node_dependencies.config.json' file at the root path",function(done){
    require(process.cwd() + '/bin/tools/generator.js')(process.cwd());
    var bExecuted = getGeneratedFile(function(){
      done();
    })
    chai.expect(bExecuted).to.equal(true);
    if (bExecuted){
      setTimeout(deleteGeneratedFile,1000);
    }
  })
})
