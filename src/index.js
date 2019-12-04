import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import gql from 'graphql-tag';
import cors from 'cors';
import express from 'express';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import axios from 'axios';

import { RTDFeedAPI } from './datasources/RTDFeedAPI';
// import { typeDefs } from './schema';
import { resolvers } from './resolvers';

require('dotenv').config();
const port = process.env.PORT || 8080;

const dataSources = () => ({ rtdFeedAPI: new RTDFeedAPI() });

var request = require('request');

// define APIs using GraphQL SDL
const typeDefs = gql`
  type Query {
    sayHello(name: String!): String!
  }

  type Mutation {
    id: String!
  }
`;

// configure express
const app = express();
app.use(cors());

const schema = makeExecutableSchema({ typeDefs, resolvers });
// build server and apply gql schema based on SDL defs and resolver maps
const apolloServer = new ApolloServer({
  dataSources,
  schema,
  introspection: true
  // context,
});
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.get('/call', (req, res) => {
  axios.get('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', {
    withCredentials: true,
    auth: {
      username: process.env.RTD_FEED_USERNAME,
      password: process.env.RTD_FEED_PASSWORD
    },
    responseType: 'arraybuffer'
  })
  .then((response) => {
    const buffer = Buffer.from(response.data, 'base64');
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
    res.send(feed);
  }).catch((err) => {
    res.send(err);
  });
});

// run server except in test env where we trigger manually
if (process.env.NODE_ENV !== 'test') {
  app.listen({ port }, () => {
    console.log(`🚀  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
  });
}