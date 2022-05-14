import { Arg, Ctx, Field, InputType, ObjectType, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MainContext } from '../types'
import argon2 from 'argon2'

// Temporary workaround, probably a better way to deal with this typing issue
// Revisit when finished w/ typescript udemy course
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

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

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MainContext) {

    if (req.session.userId) {
      const user = await em.findOne(User, { id: req.session.userId });
      return user;
    }

    return null;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em, req }: MainContext): Promise<UserResponse> {

    if (input.username.length <= 3) { // Username length validation
      return { errors: [{ message: 'Username must be at least 3 characters', field: 'username' }] };
    }

    if (input.password.length <= 3) { // Password length validation
      return { errors: [{ message: 'Password must be at least 3 characters', field: 'password' }] };
    }

    const user = em.create(User, { username: input.username, password: await argon2.hash(input.password) });

    try {
      await em.persistAndFlush(user);
    } catch (err: any) {
      if (err.code === '23505') // Username already exists error
        return { errors: [{ message: 'Username already in use', field: 'username' }] };
    }

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em, req }: MainContext): Promise<UserResponse> {

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

    req.session.userId = user.id;
    return { user: user };

  }
}