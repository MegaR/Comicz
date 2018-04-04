const webpack = require('webpack');
const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const APP_DIR = path.resolve(__dirname, 'client/app');
const BUILD_DIR = path.resolve(__dirname, 'client/public');

const config = {
    entry: APP_DIR + '/app.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    plugins: [
        new LiveReloadPlugin({})
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel-loader',
                options: {sourceMap: true}
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {sourceMap: true}
                }, {
                    loader: "resolve-url-loader",
                    options: {sourceMap: true}
                }, {
                    loader: "sass-loader",
                    options: {sourceMap: true}
                }]
            }
        ]
    }
};

module.exports = config;