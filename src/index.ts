import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Post } from './entities/Post'
import config from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(config);

  await orm.getMigrator().up();
  const post = orm.em.create(Post, { title: 'new post here' });
  await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {})
  // console.log(posts);

}

main();