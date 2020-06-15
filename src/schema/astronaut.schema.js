import {Astronaut} from "../models/Astronaut";
import {Rocket} from "../models/Rocket";
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')

export const typeDef = `
    type Astronaut {
        _id: ID!
        name: String
        surname: String
        nationality: String
        money: Float
        login: String
        pass: String
        rockets: [Rocket]
  }

  input AstronautInput{
    name: String
    surname: String
    nationality: String
    money: Int
    login: String
    password: String
  }

  extend type Query {
      astronautSchemaAssert: String
      astronauts: [Astronaut]
      astronaut(_id: ID!): Astronaut
      currentUser(Astronaut: AstronautInput): Astronaut
     
  }

  extend type Mutation {
      createAstronaut(name: String!,surname: String!,nationality: String!,money: Int!, login: String!,password: String!): Boolean
      createAstronautWithInput(input: AstronautInput!): Astronaut
      deleteAstronaut(_id: ID!): Boolean
      updateAstronaut(_id: ID!,input: AstronautInput!): Astronaut
      addRocketToAstronaut(_id: ID!, _idRocket: ID!): Boolean
      login(login: String!, password: String!): LoginResponse!
      
  }

  type LoginResponse {
        token:String,
        astronaut: Astronaut
  }
`


export const resolvers = {

    Query: {
        astronautSchemaAssert: async () => {
            return "Hello world, from Astronaut schema"
        },
        currentUser: (parent, args, { Astronaut }) => {
            // this if statement is our authentication check
            if (!Astronaut) {
              throw new Error('Not Authenticated')
            }
            return Astronaut.findOne({ id: user.id })
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
        
        createAstronaut: async (parent, {name, surname, nationality, money, login, password}, ctx, info) =>{
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await Astronaut.create({
                name,
                surname,
                nationality,
                money,
                login,
                password: hashedPassword,
            })
            return true
          },
          login: async(parent, {login, password}, ctx,info) => {
            const Astronautfind = await Astronaut.findOne({login: login});
            if(!Astronautfind){
                throw new Error('Invalid Login')
            }
            const passwordMatch = await bcrypt.compare(password, Astronautfind.password)
            if(!passwordMatch) {
                throw new Error('Invalid Login')
            }
            const token = jwt.sign(
                {
                    id: Astronautfind._id,
                    login: Astronautfind.login,
                },
                'my-secret-from-env-file-in-prod',
                {
                    expiresIn: '30d',
                },
            )
            return {
                token, astronaut: Astronautfind
            }
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