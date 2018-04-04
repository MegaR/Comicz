const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const comicVine = require('./server/comicvine.js');
const comicDownloader = require('./server/comic_downloader.js');
const storage = require('./server/storage.js');
const compression = require('compression');
const auth = require('./server/auth.js');

let app = express();
let apiRouter = express.Router();

app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());

auth.setup(apiRouter);

comicVine.setup(apiRouter);
comicDownloader.setup(apiRouter);
storage.setup(apiRouter);

app.use('/api', apiRouter);

app.use('/public', express.static(path.join(__dirname, 'client', 'public')));
app.use('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'manifest.json'));
});
app.use('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'favicon.ico'));
});
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


app.listen(3000);
console.log('listening on port 3000');

require('./server/storage.js');