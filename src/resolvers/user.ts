import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MainContext } from '../types'
import argon2 from 'argon2'

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {

  @Query(() => [User])
  users(@Ctx() { em }: MainContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => User)
  async register(
    @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em }: MainContext): Promise<User> {
    const user = em.create(User, { username: input.username, password: await argon2.hash(input.password) });
    await em.persistAndFlush(user);
    return user;
  }

}