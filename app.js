function l(msg) {console.log(msg);}

(function() {

    "use strict";

    angular.module('screenshot-server', [
        'main',
        'ui.router',
        'ngStorage',
        'listen',
        'settings',
        'insert'
    ])

    .config(['$sceProvider', '$compileProvider', '$stateProvider', '$urlRouterProvider', function($sceProvider, $compileProvider, $stateProvider, $urlRouterProvider) {
        $sceProvider.enabled(false);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|skype):/);

        $urlRouterProvider.otherwise('/listen');

        $stateProvider

        .state('listen', {
            url: '/listen',
            templateUrl: 'app/listen/listen.tpl.html',
            controller: 'ListenCtrl'
        })

        .state('insert', {
            url: '/insert',
            templateUrl: 'app/insert/insert.tpl.html',
            controller: 'InsertCtrl'
        })

        .state('settings', {
            url: '/settings',
            templateUrl: 'app/settings/settings.tpl.html',
            controller: 'SettingsCtrl'
        });
    }]);

})();