const Fs = require('fs');
const Path = require('path');
const Assert = require('assert');
const Yaml = require('yaml');
const Converter = require('..');

var TestCases = [];

TestCases.push({
    in: 'gist_fox_api.md',
    out: 'gist_fox_api.json',
});
TestCases.push({
    in: 'gist_fox_api.md',
    out: 'gist_fox_api.yaml',
});

TestCases.push({
    in: 'polls_api.md',
    out: 'polls_api.json',
});
TestCases.push({
    in: 'polls_api.md',
    out: 'polls_api.yaml',
});

TestCases.push({
    in: 'resources.md',
    out: 'resources.json',
});

TestCases.push({
    in: 'resources.md',
    out: 'resources.yaml',
});

function getPath(dir, file) {
    return Path.join(__dirname, '..', 'test', dir, file);
}

function readFile(file, callback) {
    var content = Fs.readFileSync(file, 'utf8');
    var parsed = file.endsWith('json') ? JSON.parse(content) : Yaml.parse(content);
    callback(null, parsed);
}

function doConvert(testCase) {
    try {
        var input = Fs.readFileSync(getPath('input', testCase.in), 'utf8').toString();
        return Converter.convert(input, {});
    } catch (e) {
        console.error(`File "${testCase.in}" cannot be opened.`, e);
        process.exit(1);
    }
}

describe('apib2openapi', function() {
    describe('#convert()', function() {
        TestCases.forEach(function(testCase) {
            var testName = 'should convert ' + testCase.in + ' to ' + testCase.out;
            it(testName, function(done) {
                doConvert(testCase)
                .then(result => {
                    var output = getPath('output', testCase.out);
                    readFile(output, function (error, outputContent) {
                        try {
                            Assert.deepStrictEqual(result, outputContent);
                        } catch(e) {
                            return done(e);
                        }
                        done();
                    });
                })
                .catch(function (e) {
                    done(e);
                });
            });
        });
    });
});
