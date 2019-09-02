import { Test } from './test';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

@Resolver(of => Test)
export class TestResolver {
  @Query(returns => Test)
  async author(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Test> {
    const test = new Test();
    test.id = 5;
    test.firstName = 'a';
    test.lastName = 'b';
    return await test;
  }
}
