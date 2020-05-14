import {Module} from "../models/Module"
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

export const typeDef = `
type Module {
    _id: ID!
    name: String
    multiplicator: Int
  }
  
input ModuleInput{
  name: String
  multiplicator: Int
}

extend type Query {
  moduleSchemaAssert: String
  modules: [Module]
  module(_id: ID!): Module
}

extend type Mutation {
  createModule(name: String!,multiplicator: Int!): Boolean
  createModuleWithInput(input: ModuleInput!): Module
  deleteModule(_id: ID!): Boolean
  updateModule(_id: ID!,input: ModuleInput!): Module
}`;


export const resolvers = {
  Query: {
    moduleSchemaAssert: async() => {
      return "Module schema";
    },
    modules: async () => {
      return Module.find();
      let modules = [];
      for (let index = 0; index < 5; index++) {
        modules.push(dummy(Module, {
          ignore: ignoredFields,
          returnDate: true
        }))
      } 
      return modules;
    },
    module: async (root, { _id }, context, info) => {
      
      return Module.findOne({_id});
      return dummy(Module, {
        ignore: ignoredFields,
        returnDate: true
      })
    },
  },
  Mutation: {
    createModule: async (root, args, context, info) => {
      await Module.create(args);
      return true;
    },
    createModuleWithInput: async (root, { input }, context, info) => {
      return Module.create(input);
    },
    deleteModule: async (root, { _id }, context, info) => {
      await Module.remove({ _id });
      return true
    },
    updateModule: async (root, { _id, input }) => {
      return Module.findByIdAndUpdate(_id, input, { new: true });
    }
  },
};

/*
mutation CreateModule{
  	createModule(name: "Propulseur V2", multiplicator: 2)
}

 mutation CreateModuletWithInput{
  	createModuleWithInput(input: {name: "Cocpit V1", multiplicator: 5}){name multiplicator}
}

 mutation DeleteModule{
  deleteModule(_id: "5ebcee34f922f83ea0d55fe4" )
}

mutation UpdateModule{
  	updateModule(_id: "5ebcdbf4b2342f52e8fbe243", input: {name: "Cockpit", multiplicator: 7}){name multiplicator}
}


*/

