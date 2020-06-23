import {Planet} from "../models/Planet"
import {Resource} from "../models/Resource"
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

export const typeDef = `
type Planet {
    _id: ID!
    name: String
    costDestination: Int
    imagePlanet: String
    resources: [Resource]
  }
  
  input PlanetInput{
    name: String
    costDestination: Int
    
  }

  extend type Query {
    planetSchemaAssert: String
    planets: [Planet]
    planet(_id: ID!): Planet
  }
  
  extend type Mutation {
    createPlanet(name: String!,costDestination: Int!): Boolean
    createPlanetWithInput(input: PlanetInput!): Planet
    deletePlanet(_id: ID!): Boolean
    updatePlanet(_id: ID!,input: PlanetInput!): Planet
    addResourceToPlanet(_id: ID!,_idResource: ID!): Boolean
  }`;

export const resolvers = {
  Query: {
    // Get all users
    planetSchemaAssert: async () => {
      return "Planet Schema";
    },
    // Get all users
    planets: async () => {
      return Planet.find();
      let planets = [];
      for (let index = 0; index < 5; index++) {
        planets.push(dummy(Planet, {
          ignore: ignoredFields,
          returnDate: true
        }))
      } 
      return planets;
    },
    // Get user by ID
    planet: async (root, { _id }, context, info) => {
      // With a real mongo db
      return Planet.findOne({ _id });

      //Mogoose dummy
      return dummy(Planet, {
        ignore: ignoredFields,
        returnDate: true
      })
    },
  },
  Mutation: {
    createPlanet: async (root, args, context, info) => {
      await Planet.create(args);
      return true;
    },
    createPlanetWithInput: async (root, { input }, context, info) => {
      //input.password = await bcrypt.hash(input.password, 10);
      return Planet.create(input);
    },
    deletePlanet: async (root, { _id }, context, info) => {
      await Planet.remove({ _id });
      return true
    },
    updatePlanet: async (root, { _id, input }) => {
      return Planet.findByIdAndUpdate(_id, input, { new: true });
    },
    addResourceToPlanet: async (root, {_id,_idResource }) => {
      var resource = await Resource.findById(_idResource);
      var planet = await Planet.findByIdAndUpdate(_id, {
          $push: {
              resources: resource
          }
      })
      planet.save();
      return true;
    }
  },
};

/*
mutation CreatePlanet{
  	createPlanet(name: "Tatooine", costDestination: 50000 )
}

 mutation CreatePlanetWithInput{
  	createPlanetWithInput(input: {name: "Namek", costDestination: 5}){name costDestination}
}

 mutation DeletePlanet{
  deletePlanet(_id: "5ebcf08845a4300e383f23f0" )
}


mutation UpdatePlanet{
  	updatePlanet(_id: "5ebcf0de45a4300e383f23f1", input: {name: "Terre", costDestination: 7}){name costDestination}
}
*/