import { Field, Int, ObjectType } from 'type-graphql';
import { ComicVineReference } from './comicvinereference';
import { ComicVineImages } from './comicvineimages';

@ObjectType()
export class Issue {
  @Field(type => Int)
  id: number;
  @Field()
  name: string;
  @Field()
  description: string;
  @Field(type => [String])
  aliases: string[];
  @Field()
  apiDetailUrl: string;
  @Field()
  coverDate: string;
  @Field()
  dateAdded: string;
  @Field()
  dateLastUpdated: string;
  @Field({ nullable: true })
  deck?: string;
  @Field()
  issueNumber: number;
  @Field()
  siteDetailUrl: string;
  @Field()
  storeDate: string;
  @Field()
  image: ComicVineImages;
  @Field(type => [ComicVineReference])
  characterCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  charactersDiedIn: ComicVineReference[];
  @Field(type => [ComicVineReference])
  conceptCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  locationCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  personCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  storyArcCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  teamCredits: ComicVineReference[];
  @Field(type => [ComicVineReference])
  volume: ComicVineReference[];
}
