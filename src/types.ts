import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'

export type MainContext = {
  em: EntityManager<IDatabaseDriver<Connection>>
}