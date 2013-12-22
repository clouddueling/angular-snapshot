(function() {

    'use strict';

    angular.module('settings', [])

    .controller('SettingsCtrl', ['$scope', '$localStorage', '$state', function($scope, $localStorage, $state) {
        $scope.main.running = true;

        $scope.selectSettings = function() {
            $scope.selectedSettings = $localStorage.settings;
            $scope.settingsCopy = angular.copy($localStorage.settings);
        };

        $scope.updateSettings = function(settings) {
            $localStorage.settings = settings;
            $state.go('listen');
        };

        $scope.selectSettings();
    }]);

})();