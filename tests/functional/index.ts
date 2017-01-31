(<any> require).config({
	baseUrl: '../../../',
	packages: [
		{ name: 'src', location: '_build/src' },
		{ name: 'tests', location: '_build/tests' },
		{ name: '@dojo', location: 'node_modules/@dojo' },
		{ name: 'maquette', location: 'node_modules/maquette/dist', main: 'maquette' },
		{ name: 'immutable', location: 'node_modules/immutable/dist', main: 'immutable' }
	]
});

(<any> require)([ 'tests/functional/grid' ], function () {});
