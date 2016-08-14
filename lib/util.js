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

var util = { };

util.getPath = function (obj, objPath, suppressMissingProperty) {
    console.assert(obj && typeof obj === 'object', 'Expected <obj> to be an <object>!');
    console.assert(typeof objPath === 'string', 'Expected <objPath> to be a <string>!');
    console.assert(objPath.charAt(0) === '.', 'Expected <objPath> to start with <.>!');

    var splitObjPath = objPath.split('.');
    splitObjPath.shift();
    var key = splitObjPath.shift();

    if (splitObjPath.length > 0) {
        if (!(key in obj)) {
            if (suppressMissingProperty) {
                obj[key] = { };
            } else {
                throw new Error('Missing required parent property <' + key + '> of path <' + objPath + '>!');
            }
        }

        return util.getPath(obj[key], [''].concat(splitObjPath).join('.'), suppressMissingProperty);
    }
    return obj[key];
};
util.setPath = function (obj, objPath, value, generateMissingProperties) {
    console.assert(obj && typeof obj === 'object', 'Expected <obj> to be an <object>!');
    console.assert(typeof objPath === 'string', 'Expected <objPath> to be a <string>!');
    console.assert(objPath.charAt(0) === '.', 'Expected <objPath> to start with <.>!');

    var splitObjPath = objPath.split('.');
    splitObjPath.shift();
    var key = splitObjPath.shift();

    if (splitObjPath.length > 0) {
        if (!(key in obj)) {
            if (generateMissingProperties) {
                obj[key] = { };
            } else {
                throw new Error('Missing required parent property <' + key + '> of path <' + objPath + '>!');
            }
        }

        util.setPath(obj[key], [''].concat(splitObjPath).join('.'), value, generateMissingProperties);
    } else {
        obj[key] = value;
    }
};

var _walkObjectTree = function (obj, forEach, rootObjPath) {
    for (var key in obj) {
        var value = obj[key];
        var objPath = rootObjPath + '.' + key;

        forEach('node', key, value, objPath);
        if (typeof value === 'object') {
            forEach('parent', key, value, objPath);

            _walkObjectTree(value, forEach, objPath);
        } else {
            forEach('leaf', key, value, objPath);
        }
    }
};
util.walkObjectTree = function (obj, forEach) {
    console.assert(obj && typeof obj === 'object', 'Expected <obj> to be an <object>!');
    console.assert(typeof forEach === 'function', 'Expected <forEach> to be a <function>!');

    _walkObjectTree(obj, forEach, '');
};

module.exports = util;
