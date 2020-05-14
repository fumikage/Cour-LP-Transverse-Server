import {Astronaut} from "../models/Astronaut";
import {Rocket} from "../models/Rocket";
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

export const typeDef = `
    type Astronaut {
        _id: ID!
        name: String
        surname: String
        nationality: String
        money: Float
        login: String
        pass: String
        token: String
        rockets: [Rocket]
  }

  input AstronautInput{
    name: String
    surname: String
    nationality: String
    money: Int
    login: String
    password: String
    token: String
  }

  extend type Query {
      astronautSchemaAssert: String
      astronauts: [Astronaut]
      astronaut(_id: ID!): Astronaut
  }

  extend type Mutation {
      createAstronaut(name: String!,surname: String!,nationality: String!,money: Int!, login: String!,password: String!, token: String!): Boolean
      createAstronautWithInput(input: AstronautInput!): Astronaut
      deleteAstronaut(_id: ID!): Boolean
      updateAstronaut(_id: ID!,input: AstronautInput!): Astronaut
      addRocketToAstronaut(_id: ID!, _idRocket: ID!): Boolean
  }
`


export const resolvers = {

    Query: {
        astronautSchemaAssert: async () => {
            return "Hello world, from Astronaut schema"
        },
        astronauts: async () => {
            let astronauts = [];
            for (let index = 0; index < 5; index++) {
                astronauts.push(dummy(Astronaut, {
                    ignore: ignoredFields,
                    returnDate: true
                }))
            }
            return astronauts
        },
        astronaut: async (root, { _id}, context, info) => {
            return Astronaut.findOne({ _id });
            return dummy(Astronaut, {
                ignore: ignoredFields,
                returnDate: true
            })
        },
    },
    Mutation: {
        createAstronaut: async (root, args, context, info) => {
            await Astronaut.create(args);
            return true;
          },
        createAstronautWithInput: async (root, { input }, context, info) => {
            return Astronaut.create(input);
        },
        deleteAstronaut: async (root, {_id}, context, info) => {
            await Astronaut.remove({_id});
            return true;
        },
        updateAstronaut: async (root, { _id, input }) => {
            return Astronaut.findByIdAndUpdate(_id, input, { new:true });
        },
        addRocketToAstronaut: async (root, {_id,_idRocket }) => {
            var rocket = await Rocket.findById(_idRocket);
            var astronaut = await Astronaut.findByIdAndUpdate(_id, {
                $push: {
                    rockets: rocket
                }
            })
            console.log(rocket);
            console.log(astronaut);
            astronaut.save();
            return true;
        }
    }
};
/*

Query & mutation for GraphQl


mutation CreateAstronaut{
    createAstronaut(name: "Theo",  surname: "Cherblanc", nationality: "Française", money:0, login: "theo.c" password: "testmdp", token:"1")
  }

  mutation CreateAstronautWithInput{
  	createAstronautWithInput(input: {name: "Luke", surname: "Vador"}){name surname}
}

  query GetAllUsers{
    astronauts{
      name  
      surname
    }
  }

  mutation DeleteAstronaut{
  deleteAstronaut(_id: "5ebc5718403a6c35b884a8c0" )
}

mutation UpdateAstronaut{
  	updateAstronaut(_id: "5ebcd98e06f6095570747617", input: {name: "Anakin", surname: "Vador"}){name surname}
}


  */