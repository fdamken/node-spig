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
const MODULE_NAME = require.resolve('../lib/');
// Modules.
const chai = require('chai');
const path = require('path');
// Submodules.
const expect = chai.expect;

const chdir = function(subdir) {
	process.chdir(path.join(__dirname, subdir));
};

const setup = function(subdir) {
	return function() {
		delete require.cache[MODULE_NAME];

		chdir(subdir);
	};
};

describe('#not-available', function() {
	before(setup('empty'));

	it('should throw an error', function() {
		expect(require.bind(require, MODULE_NAME)).to.throw(/^Unable to read the configuration file/);
	});
});

// TODO: Add a lot more test for a test coverage of a thousand percent ;)
