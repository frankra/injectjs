require('../../bootstrap.js');

define(['backend.src.foundation.core.Class'],Utils.proxy(function(Class){

	describe("Class extension", function() {
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

			expect(oPerson.getName()).toBe(sPersonName);
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

			expect(oPerson.getName()).toBe(sPersonName);
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

			expect(oNinja.getName()).toBe(sNinjaHasNoName);
			expect(oNinja.name).toBe(sNinjaName);
		});
	}); 
},this))
