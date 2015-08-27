require('./bootstrap.js')();

define(['src.core.Utils'],function(Utils){

	describe("src.core.Utils.prototype - Creation of the Utils Singleton", function() {
	it("Should be initialized when required, and should be a singleton.",function() {
		chai.expect(Utils).to.not.undefined;
		chai.expect(typeof Utils).to.equal('object');
	});

	});

	describe("src.core.Utils.prototype - Utils Singleton - API", function() {
		it("Should have a .proxy function that proxies the fnCallback to the "+
			"oCallbackContext.",function() {
				chai.expect(typeof Utils.proxy).to.equal('function');

				var sName = 'test';
				var oCallbackContext = {
					_name : sName
				};

				function getName(){
					return this._name;
				}

				var fnCallme = Utils.proxy(getName,oCallbackContext);

				chai.expect(fnCallme()).to.equal(sName);
		});
		it("The Proxy function should also forward the arguments to the proxied " +
			"function.",function() {
				chai.expect(typeof Utils.proxy).to.equal('function');

				var sName = 'test';
				var oCallbackContext = {
					_name : null
				};

				function setName(sName){
					this._name = sName;
				}

				chai.expect(oCallbackContext._name).to.equal.null;

				var fnProxy = Utils.proxy(setName,oCallbackContext,[sName]);
					 fnProxy();
				chai.expect(oCallbackContext._name).to.equal(sName);
		});
	});
}.bind(this));
