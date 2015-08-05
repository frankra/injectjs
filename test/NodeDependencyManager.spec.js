require('../../bootstrap.js');
var fnNodeDependencyManager = require('../../../src/foundation/core/NodeDependencyManager.js');

var oNodeDependencyManager;
function restart(){
	delete oNodeDependencyManager;
	oNodeDependencyManager = new fnNodeDependencyManager({
		path:'backend/src/foundation/core/NodeDependenciesMap.json'
	});
}


describe("Creation of the Dependency Manager", function() {
	it("Should read and parse the configuration file for the given path",
   	function() {
   		restart();
		expect(oNodeDependencyManager).not.toBeNull();
		expect(oNodeDependencyManager.getConfig()).not.toBeNull();
	});

	it("Should provide the dependency required by its alias " + 
		"and the function should return a Promise" ,
   	function() {
   		restart();

   		expect(oNodeDependencyManager.getDependency('oExpress')).not.toBeUndefined();
   		expect(oNodeDependencyManager.getDependency('oExpress') instanceof Promise).toBe(true);
   		oNodeDependencyManager.getDependency('oExpress').then(function(oExpress){
   			expect(oExpress).toBe(require('express'));
   			done();
   		})
	});

	it("Should fetch the dependencies to initialize a module before actually initializing it",
   	function() {
   		restart();
   		spyOn(oNodeDependencyManager,'_fetchDependencyByAlias').andCallThrough();

   		expect(oNodeDependencyManager.getDependency('oSocketIO')).not.toBeUndefined();
   		expect(oNodeDependencyManager.getDependency('oSocketIO') instanceof Promise).toBe(true);
   		//Loaded because oSocketIO require them
   		oNodeDependencyManager.getDependency('oSocketIO').then(function(){
   			expect(oNodeDependencyManager._fetchDependencyByAlias).toHaveBeenCalledWith('oSocketIO');
			expect(oNodeDependencyManager._fetchDependencyByAlias).toHaveBeenCalledWith('oHTTP');
			expect(oNodeDependencyManager._fetchDependencyByAlias).toHaveBeenCalledWith('oApp');
			done();
   		});
	});
	it("Should provide the dependencies as parameters when they are required for execution",
	function(){
		restart();

		var oSimpleTestDependency = {
			"name" : "test.dependency",
			"execute" : false
		}

		var oDependencyConfig = {
			"name" : "test.dependency",
			"execute" : true,
			"executionArguments" : [{
				"alias" : "oSimpleTestDependency" 
			}]
		}
	
		var fnModuleSpy = jasmine.createSpy();
		oNodeDependencyManager._requireModule = function(){return fnModuleSpy}
		
		//Inject dependency on config, so I can load it.
		oNodeDependencyManager._mConfig['oSimpleTestDependency'] = oSimpleTestDependency;
		oNodeDependencyManager._mConfig['oDependencyConfig'] = oDependencyConfig;

		oNodeDependencyManager.getDependency('oDependencyConfig').then(function(){
			expect(fnModuleSpy.callCount).toBe(1);
			//Provided the fnModuleSpy as argument. All good!
			expect(fnModuleSpy.calls[0].args[0]).toBe(fnModuleSpy);
			done();
		});
		


	});
	
	it("Should always provide the same dependency pointer. //Covered by node require cache",
	function(){
		restart();
		Promise.all([oNodeDependencyManager.getDependency('oHTTP'),oNodeDependencyManager.getDependency('oHTTP')]).then(function(aResults){
			expect(aResults[0]).toBe(aResults[1]);
			done();
		})
		
	});

}); 