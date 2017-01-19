(<any> require).config({
	baseUrl: '../../',
	packages: [
		{ name: 'src', location: '_build/src' },
		{ name: '@dojo', location: 'node_modules/@dojo' },
		{ name: 'maquette', location: 'node_modules/maquette/dist', main: 'maquette' }
	]
});

(<any> require)([ 'src/main' ], function () {});
