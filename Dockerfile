# BUILDER
FROM public.ecr.aws/lambda/nodejs:14-arm64 as builder
RUN npm i yarn -g
COPY package.json yarn.lock ./

ENV NODE_ENV=development
RUN yarn install --frozen-lockfile && yarn cache clean

COPY src src
COPY tsconfig.json tsconfig.prod.json ./

RUN yarn build

# RUNTIME
FROM public.ecr.aws/lambda/nodejs:14-arm64 as runtime
RUN npm i yarn -g
COPY package.json yarn.lock ./

ENV NODE_ENV=production
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=builder /var/task/dist dist

ENV APP_ENV=production
CMD ["dist/src/index.handler"]