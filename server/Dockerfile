FROM node:24-alpine

ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787
WORKDIR /app

COPY package.json ./
COPY server/package.json server/package-lock.json ./server/
RUN npm ci --omit=dev --prefix server

COPY lib/raft-battle.ts lib/raft-online.ts ./lib/
COPY server/raft-server.mjs ./server/

USER node
EXPOSE 8787
CMD ["node", "--experimental-strip-types", "server/raft-server.mjs"]
