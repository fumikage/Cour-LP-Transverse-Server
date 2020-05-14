import  { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
  typeDef as Astronaut,
  resolvers as astronautResolvers,
} from './schema/astronaut.schema';
import {
  typeDef as Module,
  resolvers as moduleResolvers,
} from './schema/module.schema';
import {
  typeDef as Planet,
  resolvers as planetResolvers,
} from './schema/planet.schema';
import {
  typeDef as Resource,
  resolvers as resourceResolvers,
} from './schema/resource.schema';
import {
  typeDef as Rocket,
  resolvers as rocketResolvers,
} from './schema/Rocket.schema';

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
  typeDefs: [ Query, Astronaut, Rocket, Resource, Planet, Module],
  resolvers: merge(resolvers, astronautResolvers, rocketResolvers, resourceResolvers, planetResolvers, moduleResolvers),
});