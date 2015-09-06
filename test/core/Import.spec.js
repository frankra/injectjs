require('./bootstrap.js')();

function spyRequires(){
	chai.spy.on(Import,'_readdirSync');
	chai.spy.on(Import,'_require');
}


describe("src.core.Import.prototype - Import API",function(){

	it("Should have a map between the given alias to the given physical path",function(){
		var sAlias = 'app.src.core.files';
		var sPhysicalPath = 'C:/Application/src';

		Import.mapModulePath(sAlias,sPhysicalPath);

		chai.expect(Import._getRegisterFromAlias(Import._mPathTree,sAlias.split('.')).path).to.equal(sPhysicalPath);
	});

	it("Should provide a Promise for the module required",function(){
		Import.module('src.core.Class').then(function(fnClass){
			chai.expect(fnClass).to.not.equal(undefined);
			chai.expect(Class).to.not.equal(undefined);
			done();
		});
	});

})
