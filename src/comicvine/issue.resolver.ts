import { Issue } from './models/issue';
import { ComicVineService } from './comicvine.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver(of => Issue)
export class IssueResolver {
  constructor(private readonly comicVineService: ComicVineService) {}

  @Query(returns => Issue)
  async getIssue(@Args('id') id: number): Promise<Issue> {
    const result = (await this.comicVineService.call(`issue/4000-${id}`))
      .results;
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      aliases: result.aliases ? result.aliases.split('\n') : [],
      apiDetailUrl: result.api_detail_url,
      coverDate: result.cover_date,
      dateAdded: result.date_added,
      dateLastUpdated: result.date_last_updated,
      deck: result.deck,
      issueNumber: result.issue_number,
      siteDetailUrl: result.site_detail_url,
      storeDate: result.store_date,
      image: {
        iconUrl: result.image.icon_url,
        mediumUrl: result.image.medium_url,
        screenUrl: result.image.screen_url,
        screenLargeUrl: result.image.screen_large_url,
        smallUrl: result.image.small_url,
        superUrl: result.image.super_url,
        thumbUrl: result.image.thumb_url,
        tinyUrl: result.image.tiny_url,
        originalUrl: result.image.original_url,
        imageTags: result.image.image_tags,
      },
      characterCredits: [],
      charactersDiedIn: [],
      conceptCredits: [],
      locationCredits: [],
      personCredits: [],
      storyArcCredits: [],
      teamCredits: [],
      volume: [],
    };
  }
}
