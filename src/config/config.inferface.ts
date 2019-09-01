export default interface Config {
    port: number,
    debug: boolean,
    dev: boolean,
    database: {
        test: string
    }
}