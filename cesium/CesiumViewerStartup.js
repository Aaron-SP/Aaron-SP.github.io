/*global require*/
/*eslint-disable strict*/
require({
    baseUrl: '.',
    paths: {
        domReady: 'Cesium/ThirdParty/Requirejs/domReady',
        Cesium: 'Cesium'
    }
}, [
        'CesiumViewer'
    ], function () {
    });
