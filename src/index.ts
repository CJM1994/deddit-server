import { MikroORM } from '@mikro-orm/core'
import { Post } from './entities/Post'
import config from './mikro-orm.config'

import express from 'express'


const main = async () => {
  const orm = await MikroORM.init(config);  
  await orm.getMigrator().up();

  const app = express();

  app.get('/', (req, res) => {
    res.send('hello world!');
  })

  app.listen(4000, () => {
    console.log('express listening on port 4000');
  })
}

main(); 