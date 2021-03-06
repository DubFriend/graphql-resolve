// @flow
import type { GraphQLSchema } from 'graphql';

import _ from 'lodash';
import Promise from 'bluebird';
import { GraphQLObjectType } from 'graphql';

type Parent = *;
type Args = Object;
type Context = Object;
type Ast = { fieldName:string };

export const defaultNext = (
  p:Parent,
  a:Args,
  c:Context,
  { fieldName }:Ast,
) => {
  const prop = p[fieldName];
  return _.isFunction(prop) ? prop.call(p) : prop;
};

export const promisifyNext = (
  next:(Parent, Args, Context, Ast) => *,
) => (
  parent:Parent,
  args:Args,
  context:Context,
  ast:Ast,
):Promise<*> => {
  try {
    return Promise.resolve(next(parent, args, context, ast));
  } catch (e) {
    return Promise.reject(e);
  }
};

export default function (
  schema:GraphQLSchema,
  cb:(field:*, type:GraphQLObjectType) => *,
) {
  Object.keys(schema.getTypeMap())
  .filter(typeName => typeName.indexOf('__') !== 0)
  .map(typeName => schema.getType(typeName))
  .filter(type => type instanceof GraphQLObjectType)
  .forEach((type:any) => {
    const fields = type.getFields();
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      cb(field, type);
    });
  });
}

