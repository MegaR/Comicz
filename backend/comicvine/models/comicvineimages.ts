import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ComicVineImages {
    @Field()
    iconUrl: string;
    @Field()
    mediumUrl: string;
    @Field()
    screenUrl: string;
    @Field()
    screenLargeUrl: string;
    @Field()
    smallUrl: string;
    @Field()
    superUrl: string;
    @Field()
    thumbUrl: string;
    @Field()
    tinyUrl: string;
    @Field()
    originalUrl: string;
    @Field()
    imageTags: string;
}
