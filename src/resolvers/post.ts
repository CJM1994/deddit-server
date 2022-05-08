import { Resolver, Query, Ctx } from 'type-graphql'
import { Post } from '../entities/Post'
import { MainContext } from '../types'

@Resolver()

export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MainContext): Promise<Post[]> {
    return em.find(Post, {}); 
  }
}