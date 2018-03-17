const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const comicVine = require('./server/comicvine.js');
const comicDownloader = require('./server/comic_downloader.js');
const storage = require('./server/storage.js');
const compression = require('compression');

let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(compression());

comicVine.setup(app);
comicDownloader.setup(app);
storage.setup(app);

app.use('/public', express.static(path.join(__dirname, 'client', 'public')));
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(3000);
console.log('listening on port 3000');

require('./server/storage.js');