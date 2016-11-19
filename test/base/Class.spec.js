require('./../bootstrap.js')();

define(['injectjs.base.Class'],function(Class){
  describe("src.base.Class.prototype - Class extension", function() {
    it("Given I create a new Class by extending the default Class function, " +
    "then I expect this new Class to be set on the global environment",function() {
      Class.extend('Person',{
        init: function(sName){
          this.name = sName;
        },
        getName: function(){
          return this.name;
        }
      });
      var sPersonName = 'Frank';
      var oPerson = new Person(sPersonName);

      chai.expect(oPerson.getName()).to.equal(sPersonName);
    });

    it("Should create the full path on the environment if required",function() {
      Class.extend('my.test.path.for.Person',{
        init: function(sName){
          this.name = sName;
        },
        getName: function(){
          return this.name;
        }
      });
      var sPersonName = 'Frank';
      var oPerson = new my.test.path.for.Person(sPersonName);

      chai.expect(oPerson.getName()).to.equal(sPersonName);
    });

    it("Should not override other constructors on the same namespace",function() {
      Class.extend('my.test.path.for.Person',{});
      Class.extend('my.test.path.for.Animal',{});

      chai.expect(typeof my.test.path.for.Person).to.equal('function');
      chai.expect(typeof my.test.path.for.Animal).to.equal('function');
    });

    it("Should support chain inheritance",function() {
      var sNinjaHasNoName	= "I am a Ninja, I won't tell you my name.";
      var sNinjaName = "Frank";
      my.test.path.for.Person.extend('Ninja',{
        init: function(sName){
          this.name = sName;
        },
        getName: function(){
          return sNinjaHasNoName;
        }
      });
      var oNinja = new Ninja(sNinjaName);

      chai.expect(oNinja.getName()).to.equal(sNinjaHasNoName);
      chai.expect(oNinja.name).to.equal(sNinjaName);
    });

    it("If I forget the 'new' keyword an error should happen, as this would " +
    "run the constructor as a function in the global scope",function() {
      Class.extend('test',{
      });

      chai.expect(function(){
        /*new*/	test();
      }).to.throw("Constructor called as a function. You forgot the 'new' keyword.");

    });
    it("Should be still a instanceof Class",function() {
      Class.extend('Animal',{});

      chai.expect(new Animal() instanceof Class).to.equal(true);
    });
  });
}.bind(this));
