# Comicz
Comicbook reader and tracker. Uses multiple sites as source for the comics.

## Install
The easiest way to get started is with docker.

To build the image `docker build . -t comicz`

To run it `docker run -p 3000:3000 -e comicvine_api=YOUR_COMICVINE_API_KEY comicz`

You have to use a comicvine apikey. Without it won't work. Go get one for free!

## missing
* fix sub-issues. Like 1.1, 1.2 or 1A, 1B ect.
* Alert when a new issue is released.
* documentation, unit testing. You know: the good stuff.
