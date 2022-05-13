// Express & Apollo Server
import http from 'http'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

// Mikro-ORM & GraphQL
import { MikroORM } from '@mikro-orm/core'
import config from './mikro-orm.config'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import 'reflect-metadata'

// Session storage
import session from "express-session"
import { createClient } from "redis"
import connectRedis from 'connect-redis'

// Constants
import { __prod__ } from './constants'

const bootServer = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  const app = express();

  // Session storage (cookies / user auth)
  // Must come before apollo-server middleware
  const RedisStore = connectRedis(session)
  const redisClient = createClient({ legacyMode: true })
  redisClient.connect().catch(console.error)

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: __prod__, // when true cookie only works through https
        sameSite: 'lax', // allows user to maintain login status arriving from external link
      },
      saveUninitialized: false,
      secret: "lkjads?flkasdhDlkahsdflkjadsh",
      resave: false,
    })
  )

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => {
      return { em: orm.em, req, res }
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

bootServer();