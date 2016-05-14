(function(){
	"use strict";

	const APIFolderName = 'injectjs-api-documentation';
	const GITRepo = 'https://github.com/frankrafael/injectjs-api-documentation.git';

	var exec = require('child_process').exec;
	function pipe(error, stdout, stderr, msg){
		console.log(msg);
		stdout ? console.log(`stdout: ${stdout}`) : '';
		stderr ? console.log(`stderr: ${stderr}`) : '';
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	};

	exec(`rm -r -f ${APIFolderName}`,(error, stdout, stderr) => {
		pipe(error, stdout, stderr, `Removing ${APIFolderName}`);

		exec(`git clone -b gh-pages ${GITRepo}`,(error, stdout, stderr) => {
			pipe(error, stdout, stderr, `Cloning ${GITRepo}`);

			exec(`./node_modules/jsdoc/jsdoc.js src/* -d ${APIFolderName}`,(error, stdout, stderr) => {
				pipe(error, stdout, stderr, `Generating API Documentation into ${APIFolderName}`);

				exec('git commit --all -m "Updating documentation"', {cwd: APIFolderName},(error, stdout, stderr) => {
					pipe(error, stdout, stderr, 'Committing');

					exec('git push origin gh-pages', {cwd: APIFolderName},(error, stdout, stderr) => {
						pipe(error, stdout, stderr, `push to origin gh-pages`);
					});
				});
			});
		});
	});
})();
