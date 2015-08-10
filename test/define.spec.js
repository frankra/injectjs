require(__dirname + '/bootstrap.js');

describe("src.define.prototype - Creation define", function() {

	it("Should call the implementation function once the dependencies were fetched",
   	function() {
   		define(['backend.src.foundation.core.Class'],function(Class){
   			expect(true).toBe(true); //Ok this was called.

   		})
	});
	it("Should provide the dependencies required",
   	function() {
   		define(['backend.src.foundation.core.Utils'],function(Class){
   			expect(Class).not.toBeUndefined();

   		})
	});
   it("Should provide the Node dependencies required",
      function() {
         define(['backend.src.foundation.core.Class','$oGCM'],function(Class,oGCM){
            expect(Class).not.toBeUndefined();
            expect(oGCM).not.toBeUndefined();

         })
   });

});
