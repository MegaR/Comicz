import {join} from 'path';
import {existsSync} from 'fs';
import * as defaultConfig from './config.default.json';
import Config from './config.inferface';
import {Logger} from '@nestjs/common';

export class ConfigService {
    private readonly config: Config;
    private readonly logger: Logger = new Logger('ConfigService');

    constructor() {
        const location = join(process.cwd(), 'config.json');
        if (existsSync(location)) {
            this.logger.log('Config found');
            this.config = <Config> {...defaultConfig, ...require(location)};
        } else {
            this.logger.warn('No custom config found. Using default only.');
            this.config = <Config> defaultConfig;
        }
    }

    get(): Config {
        return this.config;
    }
}