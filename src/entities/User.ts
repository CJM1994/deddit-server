import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt? = new Date();

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'varchar(255)', unique: true })
  username!: string;

  @Property({ type: 'varchar(255)'})
  password!: string;

}