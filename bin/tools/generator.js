module.exports = function(sPath){
	'use strict';

	console.log('Creating config file at: ' + sPath);

	var oFS = require('fs');

	var mTemplates = {
		/*sTemplatePath : sFileName*/
		'/templates/DependencyMap.template.json' : '/node_dependencies.config.json'
	};

	for (var sTemplatePath in mTemplates){
		var sFilePath = sPath + mTemplates[sTemplatePath];
		var sActualTemplatePath = (__dirname + sTemplatePath);
		oFS.readFile(
			sActualTemplatePath,
			'utf8',
			_getWriteFromTemplateCallback(sTemplatePath,sFilePath)
		);
	}

	function _getWriteFromTemplateCallback(sTemplatePath,sFilePath){
		return function(oReadError,oData){
			if (oReadError){
				console.log('Read Error: ' + sTemplatePath, oReadError);
			}else {
				oFS.writeFile(sFilePath, oData,'utf8',function(oWriteError){
					if (oWriteError){
					    console.log('Write Error: ' + sFilePath, oWriteError);
					}else {
						console.log('Success writing ' + sFilePath);
				    }
				});
			}
		}
	}

	return true;
};
