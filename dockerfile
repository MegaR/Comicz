FROM node

COPY . /app/
WORKDIR /app/
RUN npm install && npm run-script build

EXPOSE 3000
VOLUME ["/app/data"]
ENV comicvine_api _

CMD npm run-script start

