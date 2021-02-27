import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class ComicVineReference {
    @Field(type => Int)
    id: number;
    @Field()
    name: string;
    @Field()
    apiDetailUrl: string;
    @Field()
    siteDetailUrl: string;
}
