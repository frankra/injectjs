
describe("src.core.NodeDependencyManager.prototype - Creation of the Dependency Manager", function() {
  var __base = process.cwd();

  var fnNodeDependencyManager = require(__base + '/src/core/NodeDependencyManager.js');

  var oNodeDependencyManager;
  function restart(){
    delete oNodeDependencyManager;
    oNodeDependencyManager = new fnNodeDependencyManager({
      path:'test/core/node_dependencies.config.json'
    });
  }

  beforeEach(function(){
    require('./../bootstrap.js')();
    restart();
  });

  it("Should throw an error if the 'mParameters' argument is not provided on the constructor",function() {
    chai.expect(function(){
      new fnNodeDependencyManager();
    }).to.throw(/Missing "mParameters" argument to initialize NodeDependencyManager/);
  });

  it("Should read and parse the configuration file for the given path",function() {
    chai.expect(oNodeDependencyManager).to.not.be.null;
    chai.expect(oNodeDependencyManager.getConfig()).to.not.be.null;
  });

  it("Should throw an error if the requested dependency is not mapped on the 'node_dependencies.config.json' file" ,function() {
    chai.expect(function(){
      oNodeDependencyManager.getDependency('oDependencyNotMapped');
    }).to.throw(/Dependency with alias: "oDependencyNotMapped" is not registered, please check dependency map on/);
  });

  it("Should provide the dependency required by its alias " +
  "and the function should return a Promise" ,function(done) {

    chai.expect(oNodeDependencyManager.getDependency('oExpress')).to.not.be.undefined;
    chai.expect(oNodeDependencyManager.getDependency('oExpress') instanceof Promise).to.equal(true);
    oNodeDependencyManager.getDependency('oExpress').then(function(oExpress){
      chai.expect(oExpress).to.equal(require('express'));
      done();
    })
  });

  it("Should fetch the dependencies to initialize a module before actually initializing it",function(done) {
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
  it("Should provide the dependencies as parameters when they are required for execution",function(done){

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

  it("Should always provide the same dependency pointer. //Covered by node require cache",function(done){
    Promise.all([oNodeDependencyManager.getDependency('oHTTP'),oNodeDependencyManager.getDependency('oHTTP')]).then(function(aResults){
      chai.expect(aResults[0]).to.equal(aResults[1]);
      done();
    })
  });

  it("Should cache the promises used to fetch the dependencies, so a new promise is not required if the dependency was already loaded",function(){
    chai.expect(oNodeDependencyManager.getDependency('oHTTP')).to.equal(oNodeDependencyManager.getDependency('oHTTP'));
  });

  describe("src.core.NodeDependencyManager - Setup of Test Doubles for modules.",function(){

    var oSimpleTestDependency = {isSimpleTestDependency:true};
    var sSimpleTestDependencyAlias = 'oSimpleTestDependency';
    beforeEach(function(){
      restart();
      var oSimpleTestDependencyConfig = {
        "name" : "test.dependency",
        "execute" : false
      }
      oNodeDependencyManager._requireModule = function(){return oSimpleTestDependency};
      //Inject dependency on config, so I can load it.
      oNodeDependencyManager._mConfig[sSimpleTestDependencyAlias] = oSimpleTestDependencyConfig;
    });

    it("Should have an API that receives a test double and an alias, then overrides the loaded dependency, so that when the alias is required the test double is returned instead",function(done){
      var oTestDouble = {};
      oNodeDependencyManager.setTestDouble(sSimpleTestDependencyAlias,oTestDouble);

      oNodeDependencyManager.getDependency(sSimpleTestDependencyAlias).then(function(oDependency){
        chai.expect(oDependency).to.equal(oTestDouble);
        done();
      });
    });

    it("Should have an API to remove a test double by its alias, rolling back to the original configuration, so that when the alias is requested the original depedency is returned",function(done){
      var oTestDouble = {};
      oNodeDependencyManager.setTestDouble(sSimpleTestDependencyAlias,oTestDouble);

      oNodeDependencyManager.removeTestDouble(sSimpleTestDependencyAlias);

      oNodeDependencyManager.getDependency(sSimpleTestDependencyAlias).then(function(oDependency){
        chai.expect(oDependency).to.equal(oSimpleTestDependency);
        done();
      });
    });
  });

});
