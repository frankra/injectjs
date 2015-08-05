require('../../bootstrap.js');

define(['backend.src.foundation.core.BaseManager'],Utils.proxy(function(BaseManager){
	function restart(){
		oBaseManager = new backend.src.foundation.core.BaseManager();
	}
	describe("Creation of the Base Manager", function() {
		it("Should have a getter for its name",
	   	function() {
	   		restart();
	   		var sName = "Manager";
			oBaseManager._sName = sName;

			expect(oBaseManager.getName()).toBe(sName);
		});

		it("Should have the path for the folder it manages",
	   	function() {
	   		restart();
			
			var sPath = "../SourceObjects/";
			oBaseManager._sPath = sPath;

			expect(oBaseManager.getPath()).toBe(sPath);
		});
		it("Should fetch all Objects on the configured Path,"+
			" and add them as dependents",
	   	function() {
	   		restart();
			
			var sAlias = 'backend.src.wsockets';
			
			
			oBaseManager._sPath = sAlias;

			//oBaseManager._fetchObjectsByPath();

			expect(oBaseManager.getObjects()).not.toBeNull();
		});
	});
},this));

