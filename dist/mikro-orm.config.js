"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const config = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    },
    entities: [Post_1.Post, User_1.User],
    type: 'postgresql',
    dbName: 'deddit',
    user: 'postgres',
    password: 'postgres',
    debug: !constants_1.__prod__,
    allowGlobalContext: true,
};
exports.default = config;
