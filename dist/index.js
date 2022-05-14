"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express & Apollo Server
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
// Mikro-ORM & GraphQL
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
require("reflect-metadata");
// Session storage
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
// Constants
const constants_1 = require("./constants");
const bootServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const app = (0, express_1.default)();
    // Session storage (cookies / user auth)
    // Must come before apollo-server middleware
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = (0, redis_1.createClient)({ legacyMode: true });
    redisClient.connect().catch(console.error);
    app.use((0, express_session_1.default)({
        name: 'qid',
        store: new RedisStore({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: 'lax',
        },
        saveUninitialized: false,
        secret: "lkjads?flkasdhDlkahsdflkjadsh",
        resave: false,
    }));
    const httpServer = http_1.default.createServer(app);
    const server = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => {
            return { em: orm.em, req, res };
        },
    });
    yield server.start();
    server.applyMiddleware({
        app,
        cors: {
            origin: ["https://studio.apollographql.com"],
            credentials: true,
        },
    });
    yield new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
bootServer();
