module.exports = function(fnResolve){

	define(['backend.src.foundation.MongoConnectionManager','$oSession','$MongoStore'],function(oMongoConnectionManager,oSession,MongoStore){

		if (!global.fnSharedSession){
			console.log('creating session')

			global.fnSharedSession = oSession({
				store: new MongoStore({db: oMongoConnectionManager.getDB()}),
			    secret: "2StepAuth",
			    resave : true,
			    saveUninitialized : true,
			    cookie: {
			    	httpOnly : false
			    }
			});
		}
		

		fnResolve(fnSharedSession);

	});
}