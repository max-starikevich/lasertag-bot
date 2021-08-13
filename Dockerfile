#### TYPESCRIPT BUILDER IMAGE
FROM node:16.6-alpine as ts-builder
LABEL maintainer="maxim.starikevich@gmail.com"

USER node
ENV PATH="/home/node/app/node_modules/.bin:${PATH}"
ENV NODE_ENV=development

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./

# installing "dependencies" + "devDependencies" (see NODE_ENV)
RUN yarn install && yarn cache clean

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node ./src ./src

RUN tsc

#### SERVER RUNTIME IMAGE
FROM node:16.6-alpine as runtime
LABEL maintainer="maxim.starikevich@gmail.com"

USER node
ENV PATH="/home/node/app/node_modules/.bin:${PATH}"
ENV NODE_ENV=production

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./

# installing only "dependencies" (run-time packages, see NODE_ENV)
RUN yarn install && yarn cache clean

COPY --chown=node:node --from=ts-builder /home/node/app/build build

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./build/server.js"]