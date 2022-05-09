import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { Post } from '../entities/Post'
import { MainContext } from '../types'

@Resolver()

export class PostResolver {

  @Query(() => [Post])
  posts(@Ctx() { em }: MainContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MainContext): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: MainContext): Promise<Post | null> {
      const post = em.create(Post, { title });
      await em.persistAndFlush(post);
      return post;
  }

}