function spyRequires(){
	chai.spy.on(Import,'_readdirSync');
	chai.spy.on(Import,'_require');
}

describe("src.core.Import.prototype - Inspection",function(){

	beforeEach(function(){
		require('./../bootstrap.js')();
	});

	it("Should be a singleton",function(){
		injectjs.core.Import.module('injectjs.core.Import').then(function(oImport){
			chai.expect(injectjs.core.Import).to.equal(oImport);
			done();
		});
	});

	describe("src.core.Import.prototype - API",function(){
		describe("src.core.Import.prototype - Module Mapping",function(){
			it("Should have a map between the given alias to the given physical path",function(){
				var sAlias = 'app.src.core.files';
				var sPhysicalPath = 'C:/Application/src';

				injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

				chai.expect(injectjs.core.Import._getRegisterFromAlias(injectjs.core.Import._mPathTree,sAlias.split('.')).path).to.equal(sPhysicalPath);
			});

			it("Should append new mapped paths to the tree map, allowing enhanced mapping",function(){
				var sAlias = 'app.src.core.files';
				var sPhysicalPath = 'C:/Application/src';

				var sBranchAlias = 'app.src.core.files.services.security';
				var sBranchPhysicalPath = 'D:/Other/Source/Of/Files';

				injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);
				injectjs.core.Import.mapModulePath(sBranchAlias,sBranchPhysicalPath);

				chai.expect(injectjs.core.Import._getRegisterFromAlias(injectjs.core.Import._mPathTree,sAlias.split('.')).path).to.equal(sPhysicalPath);
				chai.expect(injectjs.core.Import._getRegisterFromAlias(injectjs.core.Import._mPathTree,sBranchAlias.split('.')).path).to.equal(sBranchPhysicalPath);
			});

			it("Should throw an error if the 'path' is not defined for a given alias",function(){
				var sAlias = 'app.src.core.files';
				var sPhysicalPath = 'C:/Application/src';
				var sUnknownAlias = 'app.src.unmapped.alias';

				injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

				chai.expect(function(){
					injectjs.core.Import.getAbsolutePath(sUnknownAlias);
				}).to.throw(/Attribute 'path' not found/);
			});
		});

		describe("src.core.Import.prototype - Import module",function(){
			it("Should provide a Promise for the module required",function(){
				injectjs.core.Import.module('injectjs.core.Class').then(function(fnClass){
					chai.expect(fnClass).to.not.equal(undefined);
					done();
				});
			});
		});

		describe("src.core.Import.prototype - Transform Alias to Path",function(){
			it("Should provide an API to transform the Alias into the physical path",function(){
				var sAlias = 'app.src.core.files';
				var sPhysicalPath = '/Application/src';

				injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

				chai.expect(injectjs.core.Import.getAbsolutePath(sAlias)).to.equal(process.cwd() + sPhysicalPath);
			});

			it("Should append the additional alias parts to the physical path",function(){
				var sAlias = 'app.src.core.files';
				var sCustomRequireAlias = 'app.src.core.files.test';

				var sPhysicalPath = '/Application/src';
				var sCustomPhysicalPath = '/Application/src/test';

				injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

				chai.expect(injectjs.core.Import.getAbsolutePath(sCustomRequireAlias)).to.equal(process.cwd() + sCustomPhysicalPath);
			});
		});
	});
});
