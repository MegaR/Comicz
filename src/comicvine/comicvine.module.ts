import { HttpModule, Module } from '@nestjs/common';
import { ComicVineService } from './comicvine.service';
import { ConfigModule } from '../config/config.module';
import {IssueResolver} from './issue.resolver';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [IssueResolver, ComicVineService],
})
export class ComicVineModule {}
