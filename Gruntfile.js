module.exports = function (grunt) {

	var staticFiles = [ 'src/**/*.html', 'src/**/*.png' ];

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

	grunt.registerTask('dev', grunt.config.get('devTasks').concat([
		'copy:staticFiles',
		'copy:staticTestFiles',
		'postcss:modules-dev'
	]));

	grunt.registerTask('dist', grunt.config.get('distTasks').concat([
		'postcss:modules-dist',
		'postcss:variables'
	]));
};
