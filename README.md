# apib2openapi

Convert API Blueprint definitions into OpenAPI 3.0
This is a node.js package that can be run from command line or used as library.  

This package is a wrapper for [apib2swagger](https://github.com/kminami/apib2swagger) converter
and [swagger2openapi](https://github.com/Mermade/oas-kit/tree/master/packages/swagger2openapi) converter.

You can use [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter) instead for more supported converter formats.  

I made this package because I want to use up-to-date swagger2openapi instead of out-of-date (still usable of course)
and I need a custom default options for the converters. I also don't need any other converters from api-spec-converter,
so here we are.

## Install

```shell
$ npm install -g apib2openapi
```

## Usage

### Command Line

Command options:

```text
$ apib2openapi --help
Usage: apib2openapi [options]

Convert API Blueprint to OpenAPI 3.0.0

Options:
  -V, --version                             output the version number
  -i, --input <file>                        Path to input (API Blueprint) file - default: STDIN
  -o, --output <file>                       Path to output (OpenAPI) file - default: STDOUT
  -y, --yaml                                Output as yaml instead of json
  -1, --apib2swagger-options <keyvalue>     Pass an option to the apib2swagger converter (default: {})
  -2, --swagger2openapi-options <keyvalue>  Pass an option to the swagger2openapi converter (default: {})
  -h, --help                                display help for command
```

Examples:

```shell
$ apib2openapi -i test.md -o test.json
$ apib2openapi -i test.md -o test.yaml
$ apib2openapi -i test.md --yaml
```

### Library

```javascript
const apib2openapi = require('apib2openapi');
let options = {};
//options.apib2swaggerOptions = true; // Pass options to apib2swagger
//options.swagger2openapiOptions = true; // Pass options to swagger2openapi

apib2openapi.convert(data, options)
.then(result => {
  // result contains the openapi
});
```

## Plan

Currently I don't have any plan to update this package any further unless I need to change something.
But, you can make a pull request or post an issue for any bug.

I also want to abandon API Blueprint completely in the near future, so this package indirectly made my
transition to OpenAPI 3.0 easier.

## License

MIT

Copyright (c) 2015 Sibghatullah Mujaddid
