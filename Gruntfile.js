module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ";\n",
            },
            javascript: {
                src: [
                    './bower_components/jquery/jquery.min.js',
                    './bower_components/moment/min/moment.min.js',
                    './bower_components/underscore/underscore-min.js',
                    './bower_components/angular/angular.min.js',
                    './bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    './app/common/firebase.js',
                    './bower_components/angularfire/angularfire.min.js',
                    './bower_components/ngstorage/ngStorage.min.js'
                ],
                dest: './build/js/base.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    './build/js/base.min.js': './build/js/base.js'
                }
            }
        },
        less: {
            development: {
                files: {
                    "./build/css/base.css": "./bower_components/bootstrap/less/bootstrap.less",
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    './build/css/base.min.css': './build/css/base.css'
                }
            }
        },
        nodewebkit: {
            options: {
                build_dir: '../webkitbuilds', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: false, // We want to build it for win
                linux32: true, // We don't need linux32
                linux64: false // We don't need linux64
            },
            src: ['./**/*'] // Your node-wekit app
        },
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'less', 'cssmin']);
    grunt.registerTask('compile', ['concat', 'uglify', 'less', 'cssmin', 'nodewebkit']);
};