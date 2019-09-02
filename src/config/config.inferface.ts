export default interface Config {
    port: number,
    debug: boolean,
    dev: boolean,
    comicvineApiKey: string,
    database: {
        test: string
    }
}