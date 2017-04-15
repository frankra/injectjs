describe("src.core.Core.prototype - Bootstrap", () =>{

  beforeEach(()=>{
    require('../bootstrap.js')();
    global.define = undefined;
  });

  it("Should instantiate the define.js class",()=>{
    require('../../src/core/Core.js')();
    chai.expect(define).not.to.be.undefined;
  });

  it("Should allow the customization of the alias used for the 'define' funciton",()=>{
    require('../../src/core/Core.js')({
      defineFunctionAlias: 'banana'
    });
    chai.expect(define).to.be.undefined;
    chai.expect(banana).not.to.be.undefined;
    //cleanup
    global.banana = undefined;
  });
  
});
