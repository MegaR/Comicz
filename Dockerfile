FROM node:8.14-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    # replacing default repositories with edge ones
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
    \
    # Add the packages
    && apk add --no-cache dumb-init curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++ nss chromium \
    \
    && npm install puppeteer@1.11.0 \
    \
    # Do some cleanup
    && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
    && rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
    && echo

#install python for npm dependencies
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

COPY . /app/
WORKDIR /app/

#removing node_modules shouldnt be nessesary but intellij plugin disagrees...
RUN rm /app/node_modules -R -f && npm install && npm run-script build

EXPOSE 3000
VOLUME ["/app/data"]
ENV comicvine_api _

ENTRYPOINT ["/usr/bin/dumb-init"]
CMD npm run-script start