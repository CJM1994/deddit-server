import { Arg, Ctx, Field, InputType, ObjectType, Mutation, Query, Resolver } from 'type-graphql'
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

@ObjectType()
class FieldError {
  @Field()
  field?: string
  @Field()
  message?: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: [FieldError]
  @Field(() => User, { nullable: true })
  user?: User
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

  @Mutation(() => UserResponse)
  async login(
    @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em }: MainContext): Promise<UserResponse> {

    // User validate
    const user = await em.findOne(User, { username: input.username });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username does not exist'
          },
        ]
      };
    }

    // Password Validate
    const validate = await argon2.verify(user.password, input.password);
    if (!validate) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password entered is not correct'
          },
        ]
      };
    }

    return { user: user };
    
  }
}