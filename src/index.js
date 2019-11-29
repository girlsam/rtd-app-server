import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import gql from 'graphql-tag';
import cors from 'cors';
import express from 'express';

// const typeDefs = require('./schema');
// const resolvers = require('./resolvers');
// const { createStore } = require('./utils');

// creates a sequelize connection once 
// const store = createStore();

// const dataSources = () => ({ rtdFeedAPI: new RTDFeedAPI() });
const port = process.env.PORT || 8080;

// define APIs using GraphQL SDL
const typeDefs = gql`
   type Query {
       sayHello(name: String!): String!
   }

   type Mutation {
       sayHello(name: String!): String!
   }
`;

// define resolvers map for API definitions in SDL
const resolvers = {
  Query: {
    sayHello: (obj, args, context, info) => {
      return `Hello ${args.name}!`;
    }
  },

  Mutation: {
    sayHello: (obj, args, context, info) => {
      return `Hello ${args.name}!`;
    }
  }
};

// configure express
const app = express();
app.use(cors());

const schema = makeExecutableSchema({ typeDefs, resolvers });
// build server and apply gql schema based on SDL defs and resolver maps
const apolloServer = new ApolloServer({
  schema
  // introspection: false
  // dataSources,
  // context,
});
apolloServer.applyMiddleware({ app, path: '/graphql' });

// run server except in test env where we trigger manually
if (process.env.NODE_ENV !== 'test') {
  app.listen({ port }, () => {
    console.log(`🚀  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
  });
}