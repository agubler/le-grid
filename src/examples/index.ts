(<any> require).config({
	baseUrl: '.',
	packages: [
		{ name: '@dojo', location: '../../../node_modules/@dojo' },
		{ name: 'maquette', location: '../../../node_modules/maquette/dist', main: 'maquette' }
	]
});

(<any> require)([ './main' ], function () {});
