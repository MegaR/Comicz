import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from './config/config.service';
import { ComicVineModule } from './comicvine/comicvine.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get().debug,
        playground: configService.get().dev,
        tracing: configService.get().debug,
        autoSchemaFile: 'schema.gql',
      }),
    }),
    ConfigModule,
    ComicVineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
