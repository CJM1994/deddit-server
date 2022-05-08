import { Options } from '@mikro-orm/core'
import { Post } from './entities/Post'
import { __prod__ } from './constants'

const config: Options = {
  entities: [Post],
  type: 'postgresql',
  dbName: 'deddit',
  user: 'postgres',
  password: 'postgres',
  debug: !__prod__,
  allowGlobalContext: true,
}

export default config;