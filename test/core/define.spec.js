describe("src.core.define.prototype - Creation define", function() {

  beforeEach(function(){
    require('./../bootstrap.js')();
  });

  it("Should call the implementation function once the dependencies were fetched",function(done) {
    define(['injectjs.core.Import'],function(Import){
      chai.expect(Import).to.not.equal(undefined);
      done();
    })
  });
  it("Should provide the same dependency module after it is fetched",function(done) {
    define(['injectjs.core.Import','injectjs.core.Import'],function(Import1, Import2){
      chai.expect(Import1).to.equal(Import2);
      done();
    })
  });
});
