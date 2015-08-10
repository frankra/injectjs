require(__dirname + '/bootstrap.js');

function spyRequires(){

	spyOn(Import,'_readdirSync').andCallThrough();
	spyOn(Import,'_require').andCallThrough();

}


describe("src.Import.prototype - Import API",function(){

	it("Should have a map between the given alias to the given physical path",
	function(){
		var sAlias = 'app.src.files';
		var sPhysicalPath = 'C:/Application/src';

		Import.mapModulePath(sAlias,sPhysicalPath);

		expect(Import._getRegisterFromAlias(Import._mPathTree,sAlias.split('.')).path).toBe(sPhysicalPath);
	});

	it("Should provide a Promise for the module required",
	function(){
		Import.module('src.Class').then(function(fnClass){
			expect(fnClass).not.toBeUndefined();
			expect(Class).not.toBeUndefined();
			done();
		});


	});
	/* FIXME - Currently there is no use case for this, however this works quite well :)
	it("The function 'path' should import all files on the given sPath, asynchronously",
	function(){
		spyRequires();

		var sAlias = 'backend.src.wsockets';

		Import.path(sAlias).then(function(aFiles){
			expect(aFiles).not.toBeUndefined();
		});

	});*/
})
