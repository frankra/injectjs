require('./bootstrap.js');

var fnExec = require('child_process').exec;
var sInitPath = 'node ./bin/client init';

var fnPath = require('path');
var sParentDir = fnPath.resolve(__dirname, '..');

describe("bin.client - Functionality",function(){
    var fnStandardImplementation = global.require;
    var fnSpy = chai.spy();
    before(function(){
        global.require = chai.spy(function(sPath){
            return fnSpy;
        })
    });

    after(function(){
        global.require = fnStandardImplementation;
    })

    it("When the 'init' argument is provided, It should trigger the generator.js providing the current path",function(done){
        fnExec(sInitPath,{cwd:sParentDir},function(){
            chai.expect(global.require).to.have.been.called.with('./tools/generator.js');
            done()
        })
    })
})
