(function() {

    'use strict';

    var gui = require('nw.gui');
    var win = gui.Window.get();
    var request = require('request');

    angular.module('listen', [])

    .controller('ListenCtrl', ['$scope', '$http', '$timeout', '$localStorage', '$state', function($scope, $http, $timeout, $localStorage, $state) {

        //
        // NOTE Setup
        // --------------------------------------------------

        $scope.main.running = false;

        function l(msg) {
            console.log(msg);
        }



        //
        // NOTE Utility
        // --------------------------------------------------

        $scope.selectJob = function(job) {
            $scope.selectedJob = job;
            $scope.jobCopy = angular.copy(job);
        };

        $scope.deselectJob = function(job) {
            $scope.selectedJob = undefined;
            $scope.jobCopy = undefined;
        };

        $scope.nextJob = function() {
            l('Finding next job.');
            _.each($scope.main.pendingJobs, function(job, key) {
                if (typeof job === 'object') {
                    $scope.runJob(job, key);
                    return;
                }
            });
        };

        $scope.resetSize = function() {
            win.resizeTo(600, 600);
        };

        $scope.resetIframe = function() {
            $scope.main.running = false;
            $scope.deselectJob();
            $scope.resetSize();
            $scope.nextJob();
        };



        //
        // NOTE Capture
        // --------------------------------------------------

        $scope.runJob = function(job, key) {
            if (job === undefined || $scope.main.running === true) {
                return;
            }

            l('Running: ' + key);
            $scope.main.running = true;

            l('Moving job to running jobs...');
            $scope.main.pendingJobs.$remove(key);

            job.runningAt = new Date().getTime();
            $scope.main.runningJobs[key] = job;
            $scope.main.runningJobs.$save(key);

            l('Selecting job...');
            $scope.selectJob(job);

            l('Preparing delay...');
            var delay = job.delay ? job.delay: $localStorage.settings.defaultDelay;

            // Enforce the maxDelay
            if (delay > $localStorage.settings.maxDelay) {
                delay = $localStorage.settings.maxDelay;
            }

            // Resize the window
            win.resizeTo(job.width, job.height);

            $timeout(function() {
                l('Capturing screenshot and html...');
                $scope.captureContents(job, key);
            }, delay);
        };

        $scope.captureContents = function(job, key) {
            var html = $('#iframe').contents().find('html').html();
            win.capturePage(function(img) {
                l('Posting to hook url...');
                $scope.postHookUrl(job, key, img, html);
            }, 'png');
        };

        $scope.postHookUrl = function(job, key, img, html) {
            if (! job.hookUrl) {
                l('Moving ' + key + ' to error jobs...');
                job.errorMessage = "No hook url found.";
                $scope.main.runningJobs.$remove(key);
                job.errorAt = new Date().getTime();
                $scope.main.errorJobs[key] = job;
                $scope.main.errorJobs.$save(key);

                $scope.resetIframe();
                return;
            }

            request.post(job.hookUrl, {
                form: {
                    image: img,
                    data: job.data,
                    html: html
                }
            }, function(error, response, body) {
                if (error) {
                    throw error;
                }

                l('Moving ' + key + ' to completed jobs...');
                $scope.main.runningJobs.$remove(key);
                job.completedAt = new Date().getTime();
                $scope.main.completedJobs[key] = job;
                $scope.main.completedJobs.$save(key);

                l('Selecting next job...');
                $scope.resetIframe();
            });
        };



        //
        // NOTE Listeners
        // --------------------------------------------------

        $scope.main.pendingJobs.$on('change', function() {
            $scope.nextJob();
        });



        //
        // NOTE Init
        // --------------------------------------------------

        $scope.nextJob();
    }]);

})();