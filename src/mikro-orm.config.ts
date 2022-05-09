import { Options } from '@mikro-orm/core'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { __prod__ } from './constants'
import path from 'path'

const config: Options = {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post, User],
  type: 'postgresql',
  dbName: 'deddit',
  user: 'postgres',
  password: 'postgres',
  debug: !__prod__,
  allowGlobalContext: true,
}

export default config;