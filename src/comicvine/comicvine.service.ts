import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable({})
export class ComicVineService {
    private readonly baseUrl = 'https://comicvine.gamespot.com/api/';
    private readonly logger: Logger = new Logger('ComicVineService');
    private readonly comicVineAPIKey: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.comicVineAPIKey = configService.get().comicvineApiKey;
        if (!this.comicVineAPIKey) {
            this.logger.error('No Comic Vine API key found in config.');
        }

        // this.call('search', {query: 'spider-men', resources: 'issue'});
    }

    public async call(url: string, params?: {}): Promise<any> {
        const defaultParams = { format: 'json', api_key: this.comicVineAPIKey };

        const response = await this.httpService
            .get(`${this.baseUrl}${url}`, {
                params: { ...defaultParams, ...params },
            })
            .toPromise();
        return response.data;
    }
}
