require('../../bootstrap.js');

define(['backend.src.foundation.core.BaseDao'],Utils.proxy(function(fnBaseDao){
   
   var oBaseDao;
   function restart(){
      oBaseDao = new fnBaseDao();
   }
   describe("Creation of the Base DAO", function() {
      it("Should have a getter for its name",
         function() {
            restart();
            var sName = "DAO";
         oBaseDao._sCollectionName = sName;

         expect(oBaseDao.getCollectionName()).toBe(sName);
      });

     

   });



},this));
