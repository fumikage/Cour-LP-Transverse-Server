import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

// User typedefs and resolvers
import {
  typeDef as User,
  resolvers as userResolvers,
} from './schema/user.schema';

// Add more schema and model here
//....
//....

// General query
const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const resolvers = {};

// Do not forget to merge at the end of typeDefs and resolvers
export const schema = makeExecutableSchema({
  typeDefs: [ Query, User],
  resolvers: merge(resolvers, userResolvers),
});