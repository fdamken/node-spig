'use strict';

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

// Constants.
var MODULE = '../lib/';
// Modules.
var chai = require('chai');
var decache = require('decache');
var path = require('path');
// Submodules.
var expect = chai.expect;

var setupEach = function (subdir, cliParameters) {
    process.chdir(path.join(__dirname, subdir));

    if (cliParameters) {
        process.argv = cliParameters;
    }
};
var teardownEach = function () {
    decache(MODULE);

    process.argv = [];
};

afterEach(teardownEach);

describe('#spig ##error', function () {
    it('should throw an error (configuration file does not exist)', function () {
        setupEach('error/empty');

        expect(require.bind(require, MODULE)).to.throw(/^Unable to read the configuration file located at: <.*config>/);
    });

    it('should throw an error (imported file does not exist)', function () {
        setupEach('error/invalid-import');

        expect(require.bind(require, MODULE)).to.throw(/^Unable to read the configuration file located at: <.*no-such-file>/);
    });
});
describe('#spig ##error-cli', function () {
    it('should print an error (configuration file does not exist)', function () {
        setupEach('error/empty', ['-snt']);

        var errors = [];
        var consoleError = console.error;
        console.error = function (msg) {
            consoleError.apply(console, arguments);

            errors.push(msg);
        };

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');

        console.error = consoleError;

        expect(errors)
            .to.have.lengthOf(1);
        expect(errors[0])
            .to.match(/^Unable to read the configuration file located at: <.*config>/);
    });
    it('should print an error (configuration file does not exist) (long)', function () {
        setupEach('error/empty', ['--spig-no-throw']);

        var errors = [];
        var consoleError = console.error;
        console.error = function (msg) {
            consoleError.apply(console, arguments);

            errors.push(msg);
        };

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');

        console.error = consoleError;

        expect(errors)
            .to.have.lengthOf(1);
        expect(errors[0])
            .to.match(/^Unable to read the configuration file located at: <.*config>/);
    });

    it('should print an error and return root configuration (imported file does not exist)', function () {
        setupEach('error/invalid-import', ['-snt']);

        var errors = [];
        var consoleError = console.error;
        console.error = function (msg) {
            consoleError.apply(console, arguments);

            errors.push(msg);
        };

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');

        console.error = consoleError;

        expect(errors)
            .to.have.lengthOf(1);
        expect(errors[0])
            .to.match(/^Unable to read the configuration file located at: <.*no-such-file>/);
    });
    it('should print an error and return root configuration (imported file does not exist) (long)', function () {
        setupEach('error/invalid-import', ['--spig-no-throw']);

        var errors = [];
        var consoleError = console.error;
        console.error = function (msg) {
            consoleError.apply(console, arguments);

            errors.push(msg);
        };

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');

        console.error = consoleError;

        expect(errors)
            .to.have.lengthOf(1);
        expect(errors[0])
            .to.match(/^Unable to read the configuration file located at: <.*no-such-file>/);
    });
});

describe('#spig ##warn', function () {
    it('should print a warning', function () {
        setupEach('warn/unsupported-import-type');

        var warnings = [];
        var consoleWarn = console.warn;
        console.warn = function (msg) {
            consoleWarn.apply(console, arguments);

            warnings.push(msg);
        };

        var config = require(MODULE);
        expect(config.roles).to.deep.equal({
            admin: 'LDAP_ADMIN'
        });

        console.warn = consoleWarn;

        expect(warnings)
            .to.have.lengthOf(1);
        expect(warnings[0])
            .to.equal('Unsupported import type: <boolean>! Must be: <string>.');
    });
});

describe('#spig ##ok', function () {
    var execute = function () {
        var config = require(MODULE);
        expect(config.db).to.deep.equal({
            url: 'mysql://localhost/test-db',
            username: 'root',
            password: '12345678'
        });
        expect(config.messages).to.deep.equal({
            de: {
                error: 'Ein Fehler ist aufgetreten!'
            },
            en: {
                error: 'An error occurred!'
            }
        });
    };

    it('should load the expected configuration (test: SIMPLE, type: JavaScript)', function () {
        setupEach('ok/simple-js');

        execute();
    });
    it('should load the expected configuration (test: SIMPLE, type: JSON)', function () {
        setupEach('ok/simple-json');

        execute();
    });

    it('should load the expected configuration (test: IMPORT SINGLE, type: JavaScript)', function () {
        setupEach('ok/import-single-js');

        execute();
    });
    it('should load the expected configuration (test: IMPORT SINGLE, type: JSON)', function () {
        setupEach('ok/import-single-json');

        execute();
    });
    it('should load the expected configuration (test: IMPORT SINGLE, type: MIXED)', function () {
        setupEach('ok/import-single-mixed');

        execute();
    });

    it('should load the expected configuration (test: IMPORT, type: JavaScript)', function () {
        setupEach('ok/import-js');

        execute();
    });
    it('should load the expected configuration (test: IMPORT, type: JSON)', function () {
        setupEach('ok/import-json');

        execute();
    });
    it('should load the expected configuration (test: IMPORT, type: MIXED)', function () {
        setupEach('ok/import-mixed');

        execute();
    });

    it('should load the expected configuration (test: IMPORT COMPLEX, type: JavaScript)', function () {
        setupEach('ok/import-complex-js');

        execute();
    });
    it('should load the expected configuration (test: IMPORT COMPLEX, type: JSON)', function () {
        setupEach('ok/import-complex-json');

        execute();
    });
    it('should load the expected configuration (test: IMPORT COMPLEX, type: MIXED)', function () {
        setupEach('ok/import-complex-mixed');

        execute();
    });
});
describe('#spig ##ok-cli', function () {
    it('should load the alternate import configuration', function () {
        setupEach('ok/alternate-import', ['-spi', '$load']);

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');
    });
    it('should load the alternate import configuration (long)', function () {
        setupEach('ok/alternate-import', ['--spig-prop-import', '$load']);

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');
    });

    it('should load alternate configuration', function () {
        setupEach('ok/alternate-config', ['-sc', 'properties']);

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');
    });
    it('should load alternate configuration (long)', function () {
        setupEach('ok/alternate-config', ['--spig-config', 'properties']);

        var config = require(MODULE);
        expect(config)
            .to.be.an('object');
        expect(config.key)
            .to.equal('value');
    });
});
