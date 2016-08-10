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
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= build.dir %>']
                }]
            },
            test: {
                files: [{
                    dot: true,
                    src: ['<%= build.test.coverage.dir %>']
                }]
            }
        },
        jslint: {
            lib: {
                src: ['<%= build.source.dir %>/<%= build.source.mask %>'],
                directives: {
                    node: true
                },
                options: {
                    jslintXml: '<%= build.dir %>/jslint.xml'
                }
            },
            test: {
                src: ['<%= build.test.dir %>/<%= build.test.mask %>'],
                directives: {
                    node: true,
                    predef: ['after', 'afterEach', 'before', 'beforeEach', 'describe', 'it', '__dirname']
                }
            },
            root: {
                src: '*.js',
                directives: {
                    node : true
                }
            }
        },
        mocha_istanbul: {
            coverage: {
                src: '<%= build.test.dir %>',
                options: {
                    mask: '<%= build.test.mask %>',
                    root: '<%= build.test.root %>'
                }
            }
        },
        copy: {
            source: {
                files: [{
                    expand: true,
                    src: '<%= build.source.dir %>/<%= build.source.mask %>',
                    dest: '<%= build.outputDir %>'
                }]
            },
            packageJson: {
                src: 'package.json',
                dest: '<%= build.outputDir %>/package.json',
                options: {
                    process: function (content) {
                        var data = JSON.parse(content);
                        delete data.devDependencies;
                        return JSON.stringify(data, null, 4);
                    }
                }
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Build tasks.
    grunt.registerTask('verify', 'Verifies that the code matches the expected code quality.', ['jslint']);
    grunt.registerTask('test', ['mocha_istanbul:coverage']);

    // Reactor tasks.
    grunt.registerTask('build', ['clean', 'verify', 'test', 'copy']);

    // Default task.
    grunt.registerTask('default', ['build']);
};

