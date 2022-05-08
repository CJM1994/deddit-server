import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class Post {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt? = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt? = new Date();

  @Field(() => String)
  @Property({type: 'varchar(255)'})
  title!: string;

}
