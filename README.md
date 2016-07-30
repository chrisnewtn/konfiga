konfiga
=======

The purpose of Konfiga is to read a bunch of stuff off of the command line and environment, and compile them into a read-only object that you can then serve as global config for your app.

### The Schema

Konfiga accepts a schema that allows you to define a bunch of options and what their related names are on the command line and in the environment.

Here's an example schema being passed to Konfiga

```js
var konfiga = require('konfiga');

var config = konfiga({
    appPort: {
        defaultValue: 3000,
        envVariableName: 'APP_PORT',
        cmdLineArgName: 'port',
        type: Number
    }
});

module.exports = config;
```

The above, assuming no values are read from the command line or your environment, will assign `config` the following:

```js
{
    appPort: 3000
}
```

The object returned by Konfiga is _frozen_ and thus read-only. Also notice that the `appPort` option in the above schema has 4 properties defined. Every option in in your schema should have them defined. Here's what they mean.

#### `defaultValue`
The value used if nothing is specified on the command line or in your environment.

#### `envVariableName`
The name of the environment variable that maps to this option. If the environment variable has a value then it is used instead of the default.

#### `cmdLineArgName`
The name of the command line argument that maps to this option. For example, if you were to start your app with `node . --port 4000` then 4000 would be used as the value for `appPort`.

Values from the command line trump both the option's default value and the value from its environment variable.

#### `required`
When this option is true a value for it must be found in the environment or as a command line argument. If no value is given, konfiga will throw an error.

#### `type`
**The only optional property**. The type to cast any values into. Everything you get from the command line or environment is a string. Sometimes it can be useful/necessary to cast values into a more appropriate type.

Acceptable types are:

* String
* Number
* Boolean
* Array

**If you do not specify a type, the value is cast to a string.**

Support for arrays is rather limited. If you specify a type as Array it will accept comma delimited values from the command line and/or environment. You can also specify your default as an JavaScript array too. For example.

```js
var config = konfiga({
    optionalFeatures: {
        defaultValue: [],
        envVariableName: 'OPTIONAL_FEATURES',
        cmdLineArgName: 'optional-features',
        type: Array
    }
});
```

Starting your app with the following

```sh
node . --optional-features feature1,feature2,feature3
```

will assign the following to `config`.

```js
{
    optionalFeatures: ['feature1', 'feature2', 'feature3']
}
```

### Konfiga Options

Konfiga accepts a second parameter consisting of an options object. `argv` and `env` are the only acceptable options.

#### `argv`
If you don't like the way [minimist][1] parses stuff from the command line, you can pass your own pre-parsed object to konfiga as the `argv` option like so:

```js
var config = konfiga(schema, { argv: myOwnParsedArgs });
```

#### `env`
By default, Konfiga get values from the enviroment using the `process.env` global. I'm not sure why you'd ever need to pass in your own equivilant object, but since I added the option for command line args, I felt I should add one for this too.

#### `parsers`
Konfiga comes with default parsers. To add more parsers, or override existing parsers, this array can be used. For example, to add a Set type:

```js
var config = konfiga(schema, {
    parsers: [
        {
            Type: Set,
            parser: function(value) {
                if (!value) {
                    return new Set();
                }

                if (Array.isArray(value)) {
                    return new Set(value);
                }

                return new Set(value.toString().split(','));
            }
        }
    ]
});
```

[1]: https://github.com/substack/minimist
