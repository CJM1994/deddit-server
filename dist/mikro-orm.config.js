"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
const config = {
    entities: [Post_1.Post],
    type: 'postgresql',
    dbName: 'deddit',
    user: 'postgres',
    password: 'postgres',
    debug: !constants_1.__prod__,
    allowGlobalContext: true,
};
exports.default = config;
