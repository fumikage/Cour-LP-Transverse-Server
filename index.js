import { ApolloServer,gql } from 'apollo-server';
import { schema } from "./src/schema";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const jwt = require ('jsonwebtoken')

const getUser = token => {
  try {
    if (token){
      return jwt.verify(token, 'my-secret-form-env-file-in-prod')
    }
    return null
  } catch (err){
    return null
  }
}

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema,
context: ({ req }) => {
  const tokenWithBearer = req.headers.authorization || ''
  const token = tokenWithBearer.split(' ')[1]
  const astronaut = getUser(token)
  return {
    astronaut
  }
} });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});