describe("src.core.Import.prototype - Inspection",function(){

  beforeEach(function(){
    require('./../bootstrap.js')();
  });

  it("Should be a singvaron",function(done){
    injectjs.core.Import.module('injectjs.core.Import').then(function(oImport){
      chai.expect(injectjs.core.Import).to.equal(oImport);
      done();
    });
  });

  describe("src.core.Import.prototype - API",function(){
    describe("src.core.Import.prototype - Map module path",function(){

      beforeEach(function(){
        injectjs.core.Import._mPathTree = {}; //Clear Mapping
      });

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

      it("Should fallback to the last node containing a path mapping, if the current resolved node does not have it.",function(){
        /*This is an edge case. Given that you have mapped the path like 'app.src',
        the framework will basically create two nodes on the mapping tree in which the last one
        is containing the 'path' attribute, which contains the physical path to the source(s).
        Now if you add a new mapping which extends the previous one, like 'app.src.core.services.security',
        again the last node will have the mapping, but now all nodes in between the 'src' node and 'security' node
        won't have any mapping, because it was not explicitely defined. The solution for these cases is fallback to
        the last valid node. See test:
        */

        var sBaseAppAlias = 'app.src';
        var sBaseAppPath = '/Application/src';

        var sAppEnhancedAlias = 'app.src.core.services.security';
        var sAppEnhancedPath = '/Another/Application/Mapping';

        var sAliasRequested = 'app.src.core.MyCoreModule';
        var sExpectedAbsolutePath = process.cwd() + sBaseAppPath/*Because it is defined by the last valid node*/ + '/core/MyCoreModule';

        injectjs.core.Import.mapModulePath(sBaseAppAlias,sBaseAppPath);
        injectjs.core.Import.mapModulePath(sAppEnhancedAlias,sAppEnhancedPath);

        chai.expect(injectjs.core.Import.getAbsolutePath(sAliasRequested)).to.equal(sExpectedAbsolutePath);
      });

      it("Should should throw an error if the path was indeed not mapped",function(){
        var sAlias = 'app.src.core.files';
        var sPhysicalPath = '/Application/src';
        var sUnknownAlias = 'app.src.unmapped.alias';
        var sExpectedAbsolutePath = process.cwd() + sPhysicalPath + '/unmapped/alias';

        injectjs.core.Import.mapModulePath(sAlias,sPhysicalPath);

        chai.expect(function(){
          injectjs.core.Import.getAbsolutePath(sUnknownAlias);
        }).to.throw(/Attribute 'path' not found on node with alias segment/);
      });
    });

    describe("src.core.Import.prototype - Set module",function(){

      beforeEach(function(){
        injectjs.core.Import._mPathTree = {}; //Clear Mapping
        injectjs.core.Import._mCachedPromises = {}; //Clear Cache
      });

      it("Should inject the module in the modules cache as a promise, even though the module is not a promise",function(done){
        var sAlias = 'app.src.core.files';
        var oModule = {
          test: true
        };

        injectjs.core.Import.setModule(sAlias,oModule);//Call API

        var oCachedPromise = injectjs.core.Import._mCachedPromises[sAlias];
        chai.expect(
          oCachedPromise instanceof Promise
        ).to.equal(true);

        oCachedPromise.then(function(oCachedModule){
          chai.expect(oCachedModule).to.deep.equal(oModule);
          done();
        })
        .catch(function(oAssertionError){
          console.log(oAssertionError);
        });
      });
      it("Should just register the module on the cache if it is a promise already",function(done){
        var sAlias = 'app.src.core.files';
        var oModule = {
          test: true
        };
        var oModulePromise = new Promise(function(fnResolve){
          fnResolve(oModule);
        })

        injectjs.core.Import.setModule(sAlias,oModulePromise);//Call API

        var oCachedPromise = injectjs.core.Import._mCachedPromises[sAlias];
        chai.expect(oModulePromise).to.deep.equal(oCachedPromise);


        oCachedPromise.then(function(oCachedModule){
          chai.expect(oCachedModule).to.deep.equal(oModule);
          done();
        })
        .catch(function(oAssertionError){
          console.log(oAssertionError);
        });
      });
    });

    describe("src.core.Import.prototype - Import module",function(){
      beforeEach(function(){
        chai.spy.on(injectjs.core.Import,'_assembleRequirePath');
        injectjs.core.Import._mCachedPromises = {}; //Clear Cache
      });
      afterEach(function(){
        injectjs.core.Import._assembleRequirePath.reset();
      });

      it("Should provide a Promise for the module required",function(){
        chai.expect(injectjs.core.Import.module('injectjs.core.Import') instanceof Promise).to.equal(true);
      });

      it("Should cache the Promise and return it if the same module is requested again without loading it again",function(){
        var oFirstPromise = injectjs.core.Import.module('injectjs.core.Import');

        chai.expect(injectjs.core.Import.module('injectjs.core.Import')).to.equal(oFirstPromise);

        chai.expect(injectjs.core.Import._assembleRequirePath).to.have.been.called.exactly(1);
      });

      it("Should return the same module on the promise",function(done){
        define([
          'injectjs.core.Import',
          'injectjs.core.Import',
          'injectjs.core.Import'
        ],function(Import1, Import2, Import3){

          chai.expect(typeof Import1).to.equal("object");
          chai.expect(typeof Import2).to.equal("object");
          chai.expect(typeof Import3).to.equal("object");

          chai.expect(Import1 === Import2 && Import2  === Import3).to.equal(true);
          done();
        });
      });

      it("Should return manually set module",function(done){
        var sPath = 'my.super.path';
        var oModule = {test:true};

        injectjs.core.Import.setModule(sPath, oModule);

        injectjs.core.Import.module(sPath)
        .then(function(oResolvedModule){
          chai.expect(
            oResolvedModule
          ).to.deep.equal(oModule);

          done();
        })
        .catch(function(oAssertionError){
          console.log(oAssertionError);
        })
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
