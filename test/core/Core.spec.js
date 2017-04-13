describe("src.core.Core.prototype - Bootstrap", function() {

  beforeEach(function(){
    require('../../src/core/Core.js')();
    require('../bootstrap.js')();
  });

  it("Should instantiate the define.js class",function() {
    chai.expect(define).not.to.be.undefined;
  });
});
