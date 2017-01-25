require.config({
    baseUrl: '../../../',
    packages: [
        { name: 'src', location: 'dist/umd' },
        { name: '@dojo', location: 'node_modules/@dojo' },
        { name: 'maquette', location: 'node_modules/maquette/dist', main: 'maquette' }
    ]
});
require(['src/examples/main'], function () { });
//# sourceMappingURL=index.js.map
