import { ApolloServer,gql } from 'apollo-server';

const typeDefs = gql`
  type Astronaut {
    name: String
    surname: String
    nationality: String
    money: Float
    login: String
    pass: String
    token: String
    rocket: Rocket
  }
  type Rocket {
    name: String
    destination: Planet
    resources:[Resource] 
    modules: [Module]
    fuel: Int
    location: Boolean
  }
  type Planet {
    name: String
    costDestination: Int
    resources: [Resource]
  }
  type Resource {
    name: String
    rarity: String
    price: Float
  }
  type Module {
    name: String
  }
  type Query {
    astronauts: [Astronaut]
    rockets: [Rocket]
    planets: [Planet]
    resources: [Resource]
    modules: [Module]
  }
`;

  const astronauts = [
    {
      name: 'Luke',
      surname: 'Skywalker',
      nationality: 'Jedi',
      money: 0,
      login:  'luke0101',
      pass: 'Ilovemyfather',
      rocket: {
        name: 'Faucon Millenium'
      }
    }
      
  ];
  const rockets = [
    {
      name: 'Faucon Millenium',
      destination: {
        name: 'Tatooine'
      },
      resources:[
        {
          name: 'Gold'
        } 
      ],
      modules: [
        {
          name: 'Propulseur v2'
        }
      ],
      fuel: 50,
      location: true
    }   
  ];
  const planets = [
    {
      name: 'Tatooine',
      costDestination: 500000,
      resources: [
        {
          name: 'Gold'
        }
      ]
    }
  ];
  const resources = [
    {
      name: 'Gold',
      rarity: 'Rare',
      price: 300
    }
  ];
  const modules = [
    {
      name: 'Propulseur v2'
    }
  ];


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      astronauts: () => astronauts,
      rockets: () => rockets,
      planets: () => planets,
      resources: ()=> resources,
      modules: ()=> modules
    },
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});