import { HttpModule, Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';
import { ComicVineService } from './comicvine.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [TestResolver, ComicVineService],
})
export class ComicVineModule {}
