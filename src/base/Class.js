function _createNamespace(sNamespace, fnConstructor){
  "use strict";

  var aSplittedNamespace = sNamespace.split('.');
  var oNavigator = global;
  for(var i = 0, ii = aSplittedNamespace.length - 1; i < ii; i++){
    if (oNavigator.hasOwnProperty(aSplittedNamespace[i])){
      oNavigator = oNavigator[aSplittedNamespace[i]];
    }else {
      oNavigator = (oNavigator[aSplittedNamespace[i]] = {});
    }
  }
  //Set the constructor of the class to the last node of the namespace
  oNavigator[aSplittedNamespace[aSplittedNamespace.length - 1]] = fnConstructor;
}

module.exports = function(fnResolve){
  "use strict";
  /**
  * Base Class
  * @class Class
  */
  function Class(){}
  /**
  * Hook function called by the constructor of the Class and its children classes.
  * @public
  */
  Class.prototype.init = function(){};
  /**
  * Create a new Class by extending the current one`s prototype.
  * @param {String} sNamespace
  * 		The path of the Class constructor function. e.g.: given 'my.new.Person', then var oPerson = new my.new.Person();
  * @param {Object} oPrototype
  The Prototype or object containing the attributes to extend the current class.
  * @public
  */
  Class.extend = function(sNamespace,oPrototype){
    //Base Constructor
    function fnClass(){
      if (!(this instanceof fnClass)){
        throw new Error("Constructor called as a function. You forgot the 'new' keyword.");
      }
      this.init.apply(this,arguments);
    }
    //Copy the prototype of this (Class) into the fnClass (temp)
    fnClass.prototype = Object.create(this.prototype);
    fnClass.prototype.constructor = fnClass;
    //Share the extend API to the new Class
    fnClass.extend = this.extend;
    //Loop through the attributes of the oPrototype param in order to extend the fnClass prototype
    Object.keys(oPrototype).forEach(function(sAttribute){
      if(!fnClass.prototype.hasOwnProperty(sAttribute)){
        fnClass.prototype[sAttribute] = oPrototype[sAttribute];
      }
    });
    //Navigate to the given sNamespace if existent, else create it.
    _createNamespace(sNamespace, fnClass);
  };
  //Add the Class to the injectjs namespace
  _createNamespace('injectjs.base.Class',Class);
  //If this was requested through the dependency management engine, resolve it, otherwise do nothing
  if(fnResolve){
    fnResolve(Class);
  }
};
