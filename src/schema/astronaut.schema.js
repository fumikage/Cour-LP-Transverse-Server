import {Astronaut} from "../models/Astronaut";
import {Rocket, createRocket} from "../models/Rocket";
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
import planetData from '../mock/planet';

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
        currentPlanet: Int
        currentProgress: Float
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
      findRocketOfAstronaut(_id: ID!): Rocket
      findPlanetSelected(_id: ID!): PlanetSelect
     
  }

  extend type Mutation {
      createAstronaut(name: String!,surname: String!,nationality: String!,money: Int!, login: String!,password: String!, rocketName: String!): LoginResponse!
      createAstronautWithInput(input: AstronautInput!): Astronaut
      deleteAstronaut(_id: ID!): Boolean
      updateAstronaut(_id: ID!,input: AstronautInput!): Astronaut
      addRocketToAstronaut(_id: ID!, _idRocket: ID!): Astronaut
      login(login: String!, password: String!): LoginResponse!
      changePlanet(_id: ID!): PlanetSelect
      
  }

  type LoginResponse {
        token:String,
        astronaut: Astronaut
  }
  type PlanetSelect {
    id: Int,
    name: String,
    costDestination: Int
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
        findRocketOfAstronaut: async (root, { _id}, context, info) => {
            const astronaut = await Astronaut.findById(_id);
            const rocket = await Rocket.findById(astronaut.rockets[0]._id)
            return rocket;
            return dummy(Astronaut, {
                ignore: ignoredFields,
                returnDate: true
            })
        },
        findPlanetSelected: async (root, {_id}, context, info) => {
            const astronaut = await Astronaut.findById(_id);
            const planets = planetData.planets
            let planetSelect;
            planets.forEach(function(planet){
                if(planet.id === astronaut.currentPlanet){
                   planetSelect = planet
                }
               
            })   
            return planetSelect       
        }
    },
    Mutation: {
        changePlanet: async (root, {_id}, context, info) => {
            const mYastronaut = await Astronaut.findById(_id);
            const astronaut = await Astronaut.findByIdAndUpdate(_id, {currentPlanet: mYastronaut.currentPlanet + 1});
            const planets = planetData.planets
            let planetSelect;
            planets.forEach(function(planet){
                if(planet.id === astronaut.currentPlanet){
                   planetSelect = planet
                }
               
            })   
            return planetSelect       
        },
        createAstronaut: async (parent, {name, surname, nationality, money, login, password, rocketName}, ctx, info) =>{
            const hashedPassword = await bcrypt.hash(password, 10)

            const astronaut = await Astronaut.create({
                name,
                surname,
                nationality,
                money,
                login,
                password: hashedPassword,
                rockets: [],
                currentPlanet: 1
               
            })
           const rocket = await Rocket.create({name: rocketName, fuel: 0, location:0});
           const rocket1 = await Rocket.findById(rocket._id)
           await Astronaut.findByIdAndUpdate(astronaut._id, {
            $push: {
                rockets: rocket1
            }
        })
            astronaut.save()
            const token = jwt.sign(
                {
                    id: astronaut._id,
                    login: astronaut.login,
                },
                'my-secret-from-env-file-in-prod',
                {
                    expiresIn: '1h',
                },
            )
            return {
                token, astronaut: astronaut
            }
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
                    expiresIn: '1h',
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
           
            astronaut.save();
            return true;
        }
    }
}
        
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