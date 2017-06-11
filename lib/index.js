'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisifyNext = exports.defaultNext = undefined;

exports.default = function (schema, cb) {
  Object.keys(schema.getTypeMap()).filter(function (typeName) {
    return typeName.indexOf('__') !== 0;
  }).map(function (typeName) {
    return schema.getType(typeName);
  }).filter(function (type) {
    return type instanceof _graphql.GraphQLObjectType;
  }).forEach(function (type) {
    var fields = type.getFields();
    Object.keys(fields).forEach(function (fieldName) {
      var field = fields[fieldName];
      cb(field, type);
    });
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultNext = exports.defaultNext = function defaultNext(p, a, c, _ref) {
  var fieldName = _ref.fieldName;

  var prop = p[fieldName];
  return _lodash2.default.isFunction(prop) ? prop.call(p) : prop;
};

var promisifyNext = exports.promisifyNext = function promisifyNext(next) {
  return function (parent, args, context, ast) {
    try {
      return _bluebird2.default.resolve(next(parent, args, context, ast));
    } catch (e) {
      return _bluebird2.default.reject(e);
    }
  };
};