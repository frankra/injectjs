require('./bootstrap.js');
var __base = require('../BaseDir.js');

var fnNodeDependencyManager = require(__base + '/src/NodeDependencyManager.js');

var oNodeDependencyManager;
function restart(){
	delete oNodeDependencyManager;
	oNodeDependencyManager = new fnNodeDependencyManager({
		path:'src/NodeDependenciesMap.json'
	});
}


describe("src.NodeDependencyManager.prototype - Creation of the Dependency Manager", function() {
	it("Should read and parse the configuration file for the given path",
   	function() {
   		restart();
		chai.expect(oNodeDependencyManager).to.not.be.null;
		chai.expect(oNodeDependencyManager.getConfig()).to.not.be.null;
	});

	it("Should provide the dependency required by its alias " +
		"and the function should return a Promise" ,
   	function(done) {
   		restart();

   		chai.expect(oNodeDependencyManager.getDependency('oExpress')).to.not.be.undefined;
   		chai.expect(oNodeDependencyManager.getDependency('oExpress') instanceof Promise).to.equal(true);
   		oNodeDependencyManager.getDependency('oExpress').then(function(oExpress){
   			chai.expect(oExpress).to.equal(require('express'));
   			done();
   		})
	});

	it("Should fetch the dependencies to initialize a module before actually initializing it",
   	function(done) {
   		restart();
   		chai.spy.on(oNodeDependencyManager,'_fetchDependencyByAlias');

   		chai.expect(oNodeDependencyManager.getDependency('oSocketIO')).to.not.be.undefined;
   		chai.expect(oNodeDependencyManager.getDependency('oSocketIO') instanceof Promise).to.equal(true);
   		//Loaded because oSocketIO require them
   		oNodeDependencyManager.getDependency('oSocketIO').then(function(){
	   		chai.expect(oNodeDependencyManager._fetchDependencyByAlias).to.have.been.called.with('oSocketIO');
				chai.expect(oNodeDependencyManager._fetchDependencyByAlias).to.have.been.called.with('oHTTP');
				chai.expect(oNodeDependencyManager._fetchDependencyByAlias).to.have.been.called.with('oApp');
				done();
   		});
	});
	it("Should provide the dependencies as parameters when they are required for execution",
	function(done){
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

		var fnModuleSpy = chai.spy();
		oNodeDependencyManager._requireModule = function(){return fnModuleSpy}

		//Inject dependency on config, so I can load it.
		oNodeDependencyManager._mConfig['oSimpleTestDependency'] = oSimpleTestDependency;
		oNodeDependencyManager._mConfig['oDependencyConfig'] = oDependencyConfig;

		oNodeDependencyManager.getDependency('oDependencyConfig').then(function(){
		  chai.expect(fnModuleSpy).to.have.been.called.exactly(1);
			//Provided the fnModuleSpy as argument. All good!
			chai.expect(fnModuleSpy).to.have.been.called.with(fnModuleSpy);
			done();
		});
	});

	it("Should always provide the same dependency pointer. //Covered by node require cache",
	function(done){
		restart();
		Promise.all([oNodeDependencyManager.getDependency('oHTTP'),oNodeDependencyManager.getDependency('oHTTP')]).then(function(aResults){
			chai.expect(aResults[0]).to.equal(aResults[1]);
			done();
		})

	});

});
