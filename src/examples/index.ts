(<any> require).config({
	baseUrl: '.',
	packages: [
		{ name: '@dojo', location: '../../../node_modules/@dojo' },
		{ name: 'maquette', location: '../../../node_modules/maquette/dist', main: 'maquette' },
		{ name: 'pepjs', location: '../../../node_modules/pepjs/dist', main: 'pep' },
		{ name: 'immutable', location: '../../../node_modules/immutable/dist', main: 'immutable' }
	]
});

(<any> require)([ './main' ], function () {});
