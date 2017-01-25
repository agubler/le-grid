module.exports = function (grunt) {

	var staticFiles = [ '**/*.html', '**/*.png' ];

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			staticDistFiles: {
				expand: true,
				cwd: 'src',
				src: staticFiles,
				dest: '<%= distDirectory %>'
			},
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
		'copy:staticDistFiles',
		'postcss:modules-dist',
		'postcss:variables'
	]));
};
