'use strict';

var apib2swagger = require('apib2swagger');
var apib2swaggerOptions = { preferReference: true, bearerAsApikey: false };

var swagger2openapi = require('swagger2openapi');
var swagger2openapiOptions = { anchors:true, direct:true, patch:true };

var Converter = module.exports = {};

Converter.apib2swaggerConverter = function(data, options) {
    return new Promise((resolve, reject) => {
        var mergedOptions = Object.assign(apib2swaggerOptions, options);
        apib2swagger.convert(data, mergedOptions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

Converter.swagger2openapiConverter = function(data, options) {
    return new Promise((resolve, reject) => {
        var mergedOptions = Object.assign(swagger2openapiOptions, options);
        swagger2openapi.convert(data, mergedOptions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

Converter.convert = function(data, options) {
    return Converter.apib2swaggerConverter(data, options.apib2swaggerOptions)
        .then(result =>
            Converter.swagger2openapiConverter(
                result.swagger,
                options.swagger2openapiOptions
            )
        );
}
