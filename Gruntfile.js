/*!
 * Copyright 2016 Fabian Damken
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        build: {
            source: {
                dir: 'lib',
                mask: '**/*.js'
            },
            test: {
                dir: 'test',
                mask: '**/*.js',
                root: '/',
                coverage: {
                    dir: 'coverage'
                }
            },
            dir: 'dist',
            outputDir: 'dist/spig'
        },
        clean: {
            test: {
                files: [{
                    dot: true,
                    src: ['<%= build.test.coverage.dir %>']
                }]
            }
        },
        jshint: {
            options: {
                mocha: true,
                node: true
            },
            lib: ['<%= build.source.dir %>/<%= build.source.mask %>'],
            test: {
                files: {
                    src: ['<%= build.test.dir %>/<%= build.test.mask %>']
                },
                options : {
                    expr: true
                }
            },
            root: ['*.js']
        },
        mocha_istanbul: {
            coverage: {
                src: '<%= build.test.dir %>',
                options: {
                    mask: '<%= build.test.mask %>',
                    root: '<%= build.test.root %>'
                }
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-release');

    // Build tasks.
    grunt.registerTask('test', ['jshint', 'mocha_istanbul:coverage']);
};

