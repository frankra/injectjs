require('./bootstrap.js');

define(['src.core.Class'],function(Class){

	describe("src.core.Class.prototype - Class extension", function() {
		it("Given I create a new Class by extending the default Class function, " +
	   	   "then I expect this new Class to be set on the global environment",
	   	function() {
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

		it("Should create the full path on the environment if required",
	   	function() {
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

		it("Should support chain inheritance",
	   	function() {
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
	});
}.bind(this))
