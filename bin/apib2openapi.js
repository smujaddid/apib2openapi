#!/usr/bin/env node

'use strict';

const Fs = require('fs');
const { Command } = require('commander');
const Program = new Command();
const Info = require('./../package.json');
const Yaml = require('yaml');
const Converter = require('..');

function keyValue (keyvalue, result) {
  const pair = keyvalue.split('=', 2);
  const key = pair[0];
  const value = JSON.parse(pair[1]);
  result[key] = value;
  return result;
}

Program.version(Info.version)
    .description(Info.description)
    .option('-i, --input <file>', 'Path to input (API Blueprint) file - default: STDIN')
    .option('-o, --output <file>', 'Path to output (OpenAPI) file - default: STDOUT')
    .option('-y, --yaml', 'Output as yaml instead of json')
    .option('-1, --apib2swagger-options <keyvalue>', 'Pass an option to the apib2swagger converter', keyValue, {})
    .option('-2, --swagger2openapi-options <keyvalue>', 'Pass an option to the swagger2openapi converter', keyValue, {})
    .parse(process.argv);

function main(input, options) {
    Converter.convert(input, {
        apib2swaggerOptions: options.apib2swaggerOptions,
        swagger2openapiOptions: options.swagger2openapiOptions,
    })
    .then(result => {
        if (options.yaml && options.output && options.output.indexOf('.json') > 0) {
            options.yaml = false;
        }
        if (!options.yaml && options.output
            && (options.output.indexOf('.yaml') > 0 || options.output.indexOf('.yml') > 0)) {
            options.yaml = true;
        }
        var swagger = result;
        var data = options.yaml
            ? Yaml.stringify(swagger, null, 2)
            : JSON.stringify(swagger, null, 2);
        options.output
            ? Fs.writeFileSync(options.output, data)
            : process.stdout.write(data);
    })
    .catch(error => {
        console.error('ERROR: Problem with parsing of Blueprint.', '\n', error);
        process.exit(error.code);
    });
}

let input = '';
if (process.stdin.isTTY || Program.input) {
    if (!Program.input) {
        Program.outputHelp();
        process.exit(1);
    }

    try {
        input = Fs
            .readFileSync(Program.input)
            .toString();
    } catch (e) {
        console.error(`File "${Program.input}" cannot be opened.`);
        process.exit(1);
    }

    main(input, {
        output: Program.output,
        yaml: Program.yaml,
        apib2swaggerOptions: Program.apib2swaggerOptions,
        swagger2openapiOptions: Program.swagger2openapiOptions,
    });
} else {
    process.stdin.on('data', (chunk) => {
        input += chunk;
    });

    process.stdin.on('end', () => {
        if (!input) {
            Program.outputHelp();
            process.exit(1);
        }

        main(input, {
            output: Program.output,
            yaml: Program.yaml,
            apib2swaggerOptions: Program.apib2swaggerOptions,
            swagger2openapiOptions: Program.swagger2openapiOptions,
        });
    });

    process.stdin.setEncoding('utf8');
}
