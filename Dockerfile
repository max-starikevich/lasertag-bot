#### TYPESCRIPT BUILDER IMAGE
ARG BASE_IMAGE=node:16.6-alpine
FROM ${BASE_IMAGE} as ts-builder
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
FROM ${BASE_IMAGE} as runtime
LABEL maintainer="maxim.starikevich@gmail.com"

USER node
ENV PATH="/home/node/app/node_modules/.bin:${PATH}"
ENV NODE_ENV=production

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./

# installing only "dependencies" (run-time packages, see NODE_ENV)
RUN yarn install && yarn cache clean

COPY --chown=node:node --from=ts-builder /home/node/app/build ./build
COPY --chown=node:node ecosystem.config.js ./

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
