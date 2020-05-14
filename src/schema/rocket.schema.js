import {Rocket} from "../models/Rocket"
import {Planet} from "../models/Planet"
import {Resource} from "../models/Resource"
import {Module} from "../models/Module"
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

export const typeDef = `
type Rocket {
  name: String
  destinations: [Planet]
  resources:[Resource] 
  modules: [Module]
  fuel: Int
  location: Int
}

input RocketInput{
  name: String
  fuel: Int
  location: Int
}
extend type Query {
  rocketSchemaAssert: String
  rockets: [Rocket]
  rocket(_id: ID!): Rocket
}
extend type Mutation {
  createRocket(name: String!,fuel: Int!,location: Int!): Boolean
  createRocketWithInput(input: RocketInput!): Rocket
  deleteRocket(_id: ID!): Boolean
  updateRocket(_id: ID!,input: RocketInput!): Rocket
  addDestinationToRocket(_id: ID!,_idPlanet: ID!): Boolean
  addModuleToRocket(_id: ID!,_idModule: ID!): Boolean
  addResourceToRocket(_id: ID!,_idResoure: ID!): Boolean
}`;

export const resolvers = {
  Query: {
    rocketSchemaAssert: async () => {
      return "Rocket schema";
    },
    rockets: async () => {
      return Rocket.find();
      let rockets = [];
      for (let index = 0; index < 5; index++) {
        rockets.push(dummy(Rocket, {
          ignore: ignoredFields,
          returnDate: true
        }))
      } 
      return rockets;
    },
    rocket: async (root, { _id }, context, info) => {
      
      return Rocket.findOne({_id});
      return dummy(Rocket, {
        ignore: ignoredFields,
        returnDate: true
      })
    },
  },
  Mutation: {
    createRocket: async (root, args, context, info) => {
      await Rocket.create(args);
      return true;
    },
    createRocketWithInput: async (root, { input }, context, info) => {
      return Rocket.create(input);
    },
    deleteRocket: async (root, { _id }, context, info) => {
      await Rocket.remove({ _id });
      return true;
    },
    updateRocket: async (root, { _id, input }) => {
      return Rocket.findByIdAndUpdate(_id, input, { new: true });
    },
    addDestinationToRocket: async (root, {_id,_idPlanet }) => {
      var planet = await Planet.findById(_idPlanet);
      var rocket = await Rocket.findByIdAndUpdate(_id, {
          $push: {
              destinations: planet
          }
      })
      rocket.save();
      return true;
    },
    addModuleToRocket: async (root, {_id,_idModule }) => {
      var module = await Module.findById(_idModule);
      var rocket = await Rocket.findByIdAndUpdate(_id, {
          $push: {
              modules: module
          }
      })
      rocket.save();
      return true;
    },
    addResourceToRocket: async (root, {_id,_idResource }) => {
      var resource = await Resource.findById(_idResource);
      var rocket = await Rocket.findByIdAndUpdate(_id, {
          $push: {
              resources: resource
          }
      })
      rocket.save();
      return true;
    }
    
  },
};
