'use strict';

module.exports = function(grunt,mClarkConfig) {
	grunt.config.set('eslint',{
		dev: {
			src: [
				'src/**/*.js',
				'bin/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('gruntify-eslint');
};
