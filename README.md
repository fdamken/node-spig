Build Status: [![Build Status](https://travis-ci.org/fdamken/node-spig.svg?branch=master)](https://travis-ci.org/fdamken/node-spig)
Build Status (develop): [![Build Status (develop)](https://travis-ci.org/fdamken/node-spig.svg?branch=develop)](https://travis-ci.org/fdamken/node-spig)





# SPIG

SPIG is a simple and powerful configuration tool that simplifies the configuration of any NodeJS module.




## Why SPIG?

Most of the common configuration modules are overloaded with features and are very complex to set up.

SPIG is the **simple** and **lightweight** configuration solution for small and big projects.




## Setting up SPIG

You just have to install SPIG to your module:

```
npm install spig --save
```




## Using SPIG

SPIG is pretty easy to use, you just have to require the module:

```
var config = require('spig');
```

SPIG will directly return your configuration so that you do not have to type a lot of boilerplate code.

---

SPIG reads the file `config.js` or `config.json` (by using `require()`) from the directory where the application where started (retrieved by `process.cwd()`). This file must contain a valid JSON (if it is a JSON file) or must return a plain old JavaScript object in the style of a JSON.

The configuration file may include other configuration files by using the property `$import` in the root of the object (or JSON) which has to have a string or an array of strings as the value. These strings must point to other configuration files relative from the directory where the importing configuration file lives or absolute. As the imported files my import other files too, you must take care of not building dependency cycles as these will result in an error.

The imported files are merge with the importing configuration file, starting from the root and with a higher priority. That is imported configuration files will overwrite the properties set in the importing configuration file.

---

If any of the files (either the root configuration file or any of the the imported files) can not be found, an exception is thrown.




## Customizing SPIG

SPIG can be customized using the follow command line options:

* `--spig-prop-import` or `-spi`: This option must be followed by the property name that should replace the default property to import files (`$import`).
* `--spig-config` or `-sc`: This option must be followed by the file name that should replace the default configuration file name (`config`).
* `--spig-no-throw` or `-snt`: This option disables the exception throwing and errors are only logged to the console. If any of the imported configurations contain errors, they are not merged with the importing configuration. If the root configuration contains errors, an empty object is returned by the `require(...)` statement.




## Examples



### Database Connection

Setting up a database connection and storing all the required configuration can be really annoying as you have to grab data from everywhere. Using SPIG all this data is held at a single place, the configuration.

The following files represent a simple database connection setup using `mongoose`.


#### Main File (index.js)

```
var mongoose = require('mongoose');
var config = require('spig');

mongoose.connect(config.db.url, config.db.options);
```


#### Configuration File (config.json)

```
{
    "db": {
        "url": "mongodb://localhost/db",
        "options": {
            "user": "root",
            "pass": "12345678"
        }
    }
}
```

And thats it - you have extracted the database configuration from your code.

---

If you do not want to check in your credentials for the database, you can create a private configuration file and set it up like this:


#### Configuration File (config.json)

```
{
    "$import": "config-private.json",
    "db": {
        "url": "mongodb://localhost/db"
    }
}
```


#### Private Configuration File (config-private.json)

```
    "db": {
        "options": {
            "user": "root",
            "pass": "12345678"
        }
    }
```
