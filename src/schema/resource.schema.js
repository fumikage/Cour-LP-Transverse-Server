import {Resource} from "../models/Resource"
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

export const typeDef = `
  type Resource {
    name: String
    rarity: String
    price: Int
  }
  
  input ResourceInput{
    name: String
    rarity: String
    price: Int
  }
  extend type Query {
    resourceSchemaAssert: String
    resources: [Resource]
    resource(_id: ID!): Resource
  }
  extend type Mutation {
    createResource(name: String!,rarity: String!, price:Int!): Boolean
    createResourceWithInput(input: ResourceInput!): Resource
    deleteResource(_id: ID!): Boolean
    updateResource(_id: ID!,input: ResourceInput!): Resource
  }`;

export const resolvers = {
  Query: {
    resourceSchemaAssert: async () => {
      return "Resource schema";
    },
    resources: async () => {
      return Resource.find();
      let resources = [];
      for (let index = 0; index < 5; index++) {
        resources.push(dummy(Resource, {
          ignore: ignoredFields,
          returnDate: true
        }))
      } 
      return resources;
    },
    resource: async (root, { _id }, context, info) => {
      
      return Resource.findOne({_id});
      return dummy(Resource, {
        ignore: ignoredFields,
        returnDate: true
      })
    },
  },
  Mutation: {
    createResource: async (root, args, context, info) => {
      await Resource.create(args);
      return true;
    },
    createResourceWithInput: async (root, { input }, context, info) => {
      return Resource.create(input);
    },
    deleteResource: async (root, { _id }, context, info) => {
      await Resource.remove({ _id });
      return true
    },
    updateResource: async (root, { _id, input }) => {
      return Resource.findByIdAndUpdate(_id, input, { new: true });
    }
  },
};

/*
mutation CreateResource{
  	createResource(name: "Gold", rarity: "rare" )
}

 mutation CreateResourceWithInput{
  	createResourceWithInput(input: {name: "Diams", rarity: "epic"}){name rarity}
}

 mutation DeleteResource{
  deleteResource(_id: "5ebcf263fbee0649bc936fe5" )
}


mutation UpdateResource{
  	updateResource(_id: "5ebcf21dfbee0649bc936fe4", input: {name: "Bronze", rarity: "Comun"}){name rarity}
}
*/