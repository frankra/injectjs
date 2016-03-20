function spyRequires(){
	chai.spy.on(Import,'_readdirSync');
	chai.spy.on(Import,'_require');
}

describe("src.core.Import.prototype - Import API",function(){

	beforeEach(function(){
		require('./../bootstrap.js')();
	});

	it("Should have a map between the given alias to the given physical path",function(){
		var sAlias = 'app.src.core.files';
		var sPhysicalPath = 'C:/Application/src';

		injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

		chai.expect(injectjs.core.Import._getRegisterFromAlias(injectjs.core.Import._mPathTree,sAlias.split('.')).path).to.equal(sPhysicalPath);
	});

	it("Should provide a Promise for the module required",function(){
		injectjs.core.Import.module('injectjs.core.Class').then(function(fnClass){
			chai.expect(fnClass).to.not.equal(undefined);
			done();
		});
	});
})
