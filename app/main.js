(function() {

    "use strict";

    angular.module('main', [
        'firebase'
    ])

    .controller('MainCtrl', ['$scope', '$firebase', '$localStorage', function($scope, $firebase, $localStorage) {

        //
        // NOTE Setup
        // --------------------------------------------------

        var defaultSettings = {
            firebaseUrl: 'https://reginald.firebaseio.com/',
            maxDelay: 15000,
            defaultDelay: 3000
        };

        $scope.main = {
            pendingJobs: {},
            runningJobs: {},
            completedJobs: {},
            running: false
        };



        //
        // NOTE Settings
        // --------------------------------------------------
        $localStorage.settings = $localStorage.settings || {};
        $localStorage.settings.firebaseUrl = $localStorage.settings.firebaseUrl || defaultSettings.firebaseUrl;
        $localStorage.settings.maxDelay = $localStorage.settings.maxDelay || defaultSettings.maxDelay;
        $localStorage.settings.defaultDelay = $localStorage.settings.defaultDelay || defaultSettings.defaultDelay;



        //
        // NOTE Firebase
        // --------------------------------------------------

        $scope.main.pendingJobs = $firebase(new Firebase($localStorage.settings.firebaseUrl + 'pending'));
        $scope.main.runningJobs = $firebase(new Firebase($localStorage.settings.firebaseUrl + 'running'));
        $scope.main.completedJobs = $firebase(new Firebase($localStorage.settings.firebaseUrl + 'completed'));
        $scope.main.errorJobs = $firebase(new Firebase($localStorage.settings.firebaseUrl + 'error'));
    }]);

})();