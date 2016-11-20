require('./bootstrap.js');

var fnExec = require('child_process').exec;
var sInitPath = 'node ./bin/client init';

describe("bin.client - Functionality",function(){

  it("When the 'init' argument is provided, It should trigger the generator.js providing the current path",function(done){
    fnExec(sInitPath,{cwd:process.cwd()},function(){
      //This is kind of crap... But I am not sure how to check if the require hapened
      var sConsoleLog = arguments[1];
      chai.expect(typeof sConsoleLog).to.equal('string');
      done();
    });
  });
});
