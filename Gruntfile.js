module.exports = function (grunt) {

	var staticFiles = [ 'src/**/*.html' ];

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			staticFiles: {
				expand: true,
				cwd: '.',
				src: staticFiles,
				dest: '<%= devDirectory %>'
			}
		}
	});

	grunt.registerTask('dev', [
		"clean:typings",
		'typings',
		'tslint',
		'clean:dev',
		'dojo-ts:dev',
		'copy:staticTestFiles',
		'copy:staticFiles'
	]);

	grunt.registerTask('dist', grunt.config.get('distTasks').concat([
		'postcss:modules',
		'postcss:variables'
	]));
};
