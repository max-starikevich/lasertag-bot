# BUILDER
FROM public.ecr.aws/lambda/nodejs:14-arm64 as builder
RUN npm i yarn -g

ENV NODE_ENV=development

COPY package.json yarn.lock ./
RUN yarn install

COPY src src
COPY tsconfig.json ./

RUN yarn build

# RUNTIME
FROM public.ecr.aws/lambda/nodejs:14-arm64 as runtime
RUN npm i yarn -g

ENV NODE_ENV=production
ENV APP_ENV=production

COPY package.json yarn.lock ./
RUN yarn install

COPY --from=builder /var/task/dist dist

CMD ["dist/src/index.handler"]