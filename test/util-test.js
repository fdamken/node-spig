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
var MODULE = '../lib/util';
// Modules.
var chai = require('chai');
// Submodules.
var expect = chai.expect;
// Module under test.
var util = require(MODULE);

describe('#util ##ok', function () {
    it('should get the path <.db.options.auth.username>', function () {
        var actual = util.getPath({
            db: {
                options: {
                    auth: {
                        username: 'root'
                    }
                }
            }
        }, '.db.options.auth.username');

        expect(actual)
            .to.equal('root');
    });
    it('should get the missing path <.db.url>', function () {
        var actual = util.getPath({ }, '.db.url', true);

        expect(actual)
            .to.be.undefined;
    });

    it('should set the path <.db.options.auth.password>', function () {
        var obj = {
            db: {
                options: {
                    auth: {
                        username: 'root'
                    }
                }
            }
        };

        util.setPath(obj, '.db.options.auth.password', '12345678');

        expect(obj)
            .to.deep.equal({
                db: {
                    options: {
                        auth: {
                            username: 'root',
                            password: '12345678'
                        }
                    }
                }
            });
    });
    it('should set the missing path <.db.url>', function () {
        var obj = { };

        util.setPath(obj, '.db.url', 'localhost', true);

        expect(obj)
            .to.deep.equal({
                db: {
                    url: 'localhost'
                }
            });
    });

    it('should walk the object tree', function () {
        var obj = {
            db: {
                url: 'mysql://localhost/test-db',
                username: 'root',
                password: '12345678'
            },
            messages: {
                de: {
                    error: 'Ein Fehler ist aufgetreten!'
                },
                en: {
                    error: 'An error occurred!'
                }
            }
        };

        var nodes = { };
        var parents = { };
        var leafs = { };
        util.walkObjectTree(obj, function (type, key, value, objPath) {
            expect(type)
                .to.be.oneOf(['node', 'parent', 'leaf']);

            switch (type) {
                case 'node':
                    nodes[objPath] = value;
                    break;
                case 'parent':
                    parents[objPath] = value;
                    break;
                case 'leaf':
                    leafs[objPath] = value;
                    break;
                default:
                    throw new Error('This is impossible!');
            }
        });

        expect(nodes)
            .to.deep.equal({
                '.db': {
                    url: 'mysql://localhost/test-db',
                    username: 'root',
                    password: '12345678'
                },
                '.db.url': 'mysql://localhost/test-db',
                '.db.username': 'root',
                '.db.password': '12345678',
                '.messages': {
                    de: {
                        error: 'Ein Fehler ist aufgetreten!'
                    },
                    en: {
                        error: 'An error occurred!'
                    }
                },
                '.messages.de': {
                    error: 'Ein Fehler ist aufgetreten!'
                },
                '.messages.de.error': 'Ein Fehler ist aufgetreten!',
                '.messages.en': {
                    error: 'An error occurred!'
                },
                '.messages.en.error': 'An error occurred!'
            });
        expect(parents)
            .to.deep.equal({
                '.db': {
                    url: 'mysql://localhost/test-db',
                    username: 'root',
                    password: '12345678'
                },
                '.messages': {
                    de: {
                        error: 'Ein Fehler ist aufgetreten!'
                    },
                    en: {
                        error: 'An error occurred!'
                    }
                },
                '.messages.de': {
                    error: 'Ein Fehler ist aufgetreten!'
                },
                '.messages.en': {
                    error: 'An error occurred!'
                }
            });
        expect(leafs)
            .to.deep.equal({
                '.db.url': 'mysql://localhost/test-db',
                '.db.username': 'root',
                '.db.password': '12345678',
                '.messages.de.error': 'Ein Fehler ist aufgetreten!',
                '.messages.en.error': 'An error occurred!'
            });
    });
});

describe('#util ##error', function () {
    it('should throw an error on getting as <obj> is not an <object>', function () {
        expect(util.getPath.bind(util, null, '.db.url'))
            .to.throw('AssertionError: Expected <obj> to be an <object>!');
    });
    it('should throw an error on getting as <objPath> is not a <string>', function () {
        expect(util.getPath.bind(util, { }, null))
            .to.throw('AssertionError: Expected <objPath> to be a <string>!');
    });
    it('should throw an error on getting as <objPath> does not start with a dot', function () {
        expect(util.getPath.bind(util, { }, 'db.url'))
            .to.throw('AssertionError: Expected <objPath> to start with <.>!');
    });
    it('should throw an error on getting <.db.url> as it does not exist', function () {
        expect(util.getPath.bind(util, { }, '.db.url'))
            .to.throw('Missing required parent property <db> of path <.db.url>!');
    });

    it('should throw an error on setting as <obj> is not an <object>', function () {
        expect(util.setPath.bind(util, null, '.db.url'))
            .to.throw('AssertionError: Expected <obj> to be an <object>!');
    });
    it('should throw an error on setting as <objPath> is not a <string>', function () {
        expect(util.setPath.bind(util, { }, null, 'value'))
            .to.throw('AssertionError: Expected <objPath> to be a <string>!');
    });
    it('should throw an error on setting as <objPath> does not start with a dot', function () {
        expect(util.setPath.bind(util, { }, 'db.url', 'localhost'))
            .to.throw('AssertionError: Expected <objPath> to start with <.>!');
    });
    it('should throw an error on getting <.db.url> as it does not exist', function () {
        expect(util.setPath.bind(util, { }, '.db.url', 'localhost'))
            .to.throw('Missing required parent property <db> of path <.db.url>!');
    });

    it('should throw an error on walking the object tree as <obj> is not an <object>', function () {
        expect(util.walkObjectTree.bind(util, null, function() { }))
            .to.throw('AssertionError: Expected <obj> to be an <object>!');
    });
    it('should throw an error on walking the object tree as <forEach> is not a <function>', function () {
        expect(util.walkObjectTree.bind(util, { }, null))
            .to.throw('AssertionError: Expected <forEach> to be a <function>!');
    });
});
