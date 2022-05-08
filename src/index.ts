import { MikroORM } from '@mikro-orm/core'
import { Post } from './entities/Post'
import config from './mikro-orm.config'

import http from 'http'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'

const bootServer = async () => {
  const orm = await MikroORM.init(config);  
  await orm.getMigrator().up();

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    })
  });
  await server.start();
  server.applyMiddleware({app});
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

bootServer(); 