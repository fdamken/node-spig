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

// Variable declaration.
var config, expConfig, extend, fs, path, properties, readFile;



    // ~ Modules ~

extend = require('extend');
fs = require('fs');
path = require('path');



    // ~ Configuration ~

config = extend(true, { }, {
    property: {
        import: '$import'
    },
    config: {
        filename: 'config'
    },
    error: {
        throw: true
    }
}, (function () {
    // Variable declaration.
    var assignNext, cliArguments;


    cliArguments = {
        property: { },
        config: { },
        error: { }
    };

    assignNext = null;
    process.argv.forEach(function (argument) {
        if (assignNext) {
            assignNext(argument);
        }

        if (argument === '-spi' || argument === '--spig-prop-import') {
            assignNext = function (value, store) {
                cliArguments.property.import = value;
            };
        } else if (argument === '-sc' || argument === '--spig-config') {
            assignNext = function (value, store) {
                cliArguments.config.filename = value;
            };
        } else if (argument === '-snt' || argument === '--spig-no-throw') {
            cliArguments.error.throw = false;
        }
    });

    return cliArguments;
}()));



    // ~ Methods ~

readFile = function (filepath) {
    // Variable declaration.
    var content, directory, err, imports, msg;


    directory = path.dirname(filepath);

    try {
        content = extend(true, { }, require(filepath));
    } catch (ex) {
        msg = 'Unable to read the configuration file located at: <' + filepath + '>!';

        if (config.error.throw) {
            err = new Error(msg);
            err.stack += '\nCaused by:\n' + ex.stack;
            throw err;
        }

        console.error(msg, ex);
        return { };
    }

    if (content[config.property.import]) {
        imports = (content[config.property.import] instanceof Array ? content[config.property.import] : [content[config.property.import]]);
        delete content[config.property.import];

        imports.forEach(function (importFileName) {
            // Variable declaration.
            var importedContent;


            if (typeof importFileName !== 'string') {
                console.warn('Unsupported import type: <' + (typeof importFileName) + '>! Must be: <string>.');
                return;
            }

            content = extend(true, { }, content, readFile(path.join(directory, importFileName)));
        });
    }

    return content;
};



    // ~ Exporting ~



expConfig = readFile(path.join(process.cwd(), config.config.filename));

expConfig.$readFile = readFile;

module.exports = expConfig;
