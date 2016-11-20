var fnCore;

function reset(){
  fnCore = require('../../src/core/Core.js')(__dirname);
}

describe("src.core.Core.prototype - Bootstrap", function() {

  it("Should instantiate the Utils.js class",function() {
    reset();
    chai.expect(global.injectjs.core.Utils).not.to.be.undefined;
  });

  it("Should instantiate the Import.js class",function() {
    reset();
    chai.expect(global.injectjs.core.Import).not.to.be.undefined;
  });

  it("Should create a map from the source folder to the namespace alias",function() {
    reset();
    var sAlias = 'src.core';
    var sPhysicalPath = '/src/core';

    injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

    chai.expect(injectjs.core.Import._getRegisterFromAlias(injectjs.core.Import._mPathTree,sAlias.split('.')).path).to.equal(sPhysicalPath);
  });

  it("Should instantiate the NodeDependencyManager.js class",function() {
    reset();
    chai.expect(injectjs.core.NodeDependencyManager).not.to.be.undefined;
  });

  it("Should instantiate the define.js class",function() {
    reset();
    chai.expect(define).not.to.be.undefined;
  });
});
