require('./bootstrap.js')();

describe("src.core.define.prototype - Creation define", function() {

	it("Should call the implementation function once the dependencies were fetched",function(done) {
		define(['injectjs.core.Class'],function(Class){
			chai.expect(true).to.equal(true); //Ok this was called.
				done();
		})
	});
	it("Should provide the dependencies required",function(done) {
		define(['injectjs.core.Utils'],function(Class){
			chai.expect(Class).to.not.equal(undefined);
				done();
		})
	});
	it("Should provide the Node dependencies required",function(done) {
			define(['injectjs.core.Class','$oGCM'],function(Class,oGCM){
				chai.expect(Class).to.not.equal(undefined);
				chai.expect(oGCM).to.not.equal(undefined);
				done();
			})
	});
});
