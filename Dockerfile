# BUILDER
FROM public.ecr.aws/lambda/nodejs:18-arm64 as builder
RUN npm i pnpm@8 -g
COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV=development
ENV CI=true
RUN pnpm i --ignore-scripts

COPY src src
COPY tsconfig.json tsconfig.prod.json ./

RUN pnpm build

# RUNTIME
FROM public.ecr.aws/lambda/nodejs:18-arm64 as runtime
RUN npm i pnpm@8 -g
COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV=production
ENV CI=true
RUN pnpm i --ignore-scripts

COPY --from=builder /var/task/dist dist

ENV APP_ENV=production
CMD ["dist/src/index.handler"]