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
		'copy:staticDistFiles',
		'postcss:modules',
		'postcss:variables'
	]));
};
