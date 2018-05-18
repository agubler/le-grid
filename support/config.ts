const pkgDir = require('pkg-dir');
const { join } = require('path');
const createProcessors = require('grunt-dojo2/tasks/util/postcss').createProcessors;

const packagePath = pkgDir.sync(process.cwd());

const fontFiles = 'theme/fonts/*.{svg,ttf,woff}';
const staticExampleFiles = ['*/example/**', '!*/example/**/*.js'];
const staticTestFiles = '*/tests/**/*.{html,css,json,xml,js,txt}';

export const copy = {
	'staticDefinitionFiles-dev': {
		cwd: 'src',
		src: ['<%= staticDefinitionFiles %>'],
		dest: '<%= devDirectory %>'
	},
	staticTestFiles: {
		expand: true,
		cwd: 'src',
		src: [staticTestFiles],
		dest: '<%= devDirectory %>'
	},
	staticExampleFiles: {
		expand: true,
		cwd: 'src',
		src: staticExampleFiles,
		dest: '<%= devDirectory %>'
	},
	devFonts: {
		expand: true,
		cwd: 'src',
		src: fontFiles,
		dest: '<%= devDirectory %>'
	},
	distFonts: {
		expand: true,
		cwd: 'src',
		src: fontFiles,
		dest: '<%= distDirectory %>'
	},
	devStyles: {
		expand: true,
		cwd: 'src',
		src: '**/example.css',
		dest: '<%= devDirectory %>'
	}
};

export const postcss = {
	'modules-dev': {
		files: [
			{
				expand: true,
				src: ['**/*.m.css'],
				dest: '<%= devDirectory %>',
				cwd: 'src'
			}
		],
		options: {
			processors: createProcessors({
				dest: '_build/',
				cwd: 'src',
				packageJson: require(join(packagePath, 'package.json'))
			})
		}
	}
};

export const intern = {
	version: 4
};
