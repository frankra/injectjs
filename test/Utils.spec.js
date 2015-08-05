require('../../bootstrap.js');

define(['backend.src.foundation.core.Utils'],Utils.proxy(function(Utils){
   
   describe("Creation of the Utils Singleton", function() {
   it("Should be initialized when required, and should be a singleton.",
      function() {
         expect(Utils).not.toBeUndefined();
         expect(typeof Utils).toBe('object');
   });

   });

   describe("Utils Singleton - API", function() {
      it("Should have a .proxy function that proxies the fnCallback to the "+ 
         "oCallbackContext.",
         function() {
            expect(typeof Utils.proxy).toBe('function');

            var sName = 'test';
            var oCallbackContext = {
               _name : sName
            };

            function getName(){
               return this._name;
            }

            var fnCallme = Utils.proxy(getName,oCallbackContext);

            expect(fnCallme()).toBe(sName);
      });
      it("The Proxy function should also forward the arguments to the proxied " +
         "function.",
         function() {
            expect(typeof Utils.proxy).toBe('function');

            var sName = 'test';
            var oCallbackContext = {
               _name : null
            };

            function setName(sName){
               this._name = sName;
            }

            expect(oCallbackContext._name).toBeNull();

            var fnProxy = Utils.proxy(setName,oCallbackContext,[sName]);
                fnProxy();
            expect(oCallbackContext._name).toBe(sName);
      });


   });


},this));

