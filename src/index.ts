import {MikroORM} from '@mikro-orm/core'

const main = async () => {
  const orm = await MikroORM.init({
    type: 'postgresql',
    dbName: 'deddit',
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    debug: process.env.NODE_ENV !== 'production',
  });
}

main();