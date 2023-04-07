# =========== development ===========

FROM		node:19-alpine As development

RUN			npm install -g npm@latest

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

# =========== build for production ===========

FROM node:19-alpine As build

RUN			npm install -g npm@latest

WORKDIR /app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

# =========== production ===========

FROM node:19-alpine As production

#RUN			npm install -g npm@latest
RUN			apk --no-cache add curl

COPY --chown=node:node . .
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

EXPOSE		3500

ENTRYPOINT ["sh", "/app/entrypoint-server.sh"]
