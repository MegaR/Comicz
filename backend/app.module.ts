import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from './config/config.service';
import { ComicVineModule } from './comicvine/comicvine.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'frontend'),
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
