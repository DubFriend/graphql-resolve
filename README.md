# graphql-resolve

Hook into each resolve method on a GraphQL schema

```javascript
import graphqlResolve, { promisifyNext, defaultNext } from 'graphql-resolve';
import schema from './my-graphql-schema';

const intercept = next => (parent, args, context, ast) => {
  return promisifyNext(next)(parent, args, context, ast);
};

graphqlResolve(schema, (field, type) => {
  field.resolve = intercept(field.resolve || defaultNext);
});
```
