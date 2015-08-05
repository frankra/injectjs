require('../../bootstrap.js');

define(['backend.src.foundation.core.BaseWebSocket'],Utils.proxy(function(fnBaseWebSocket){
	console.log('ok')
	function restart(){
		oBaseWebSocket = new backend.src.foundation.core.BaseWebSocket();
	}

	describe("Check properties of the Base Web Socket", function() {
		it("Should have a getter and setter for the name of the interface",
	   	function() {
	   		restart();
			
			var sInterfaceName = 'authentication';

			oBaseWebSocket.setName(sInterfaceName);
			expect(oBaseWebSocket.getName()).toBe(sInterfaceName);
		});

		it("Should have a getter but not a setter for the interface implementation function (callback)",
		function(){
			restart();
			
			var fnInterfaceImpl = function(){};
			// inject test function
			oBaseWebSocket._fnInterfaceCallback = fnInterfaceImpl;
			
			expect(typeof oBaseWebSocket.getImplementation()).toBe('function');
		});
	});
},this));




	