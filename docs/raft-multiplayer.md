# Poké Raft online multiplayer

Poké Raft supports two players on separate devices through a WebSocket room. The website stays on GitHub Pages; the game server runs separately. GitHub Pages serves static HTML, CSS, and JavaScript and cannot run the persistent Node process needed for these rooms. See [GitHub Pages hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Run locally

Use Node.js 22.18 or newer. From the repository root, install the server's separate dependencies and start it:

```sh
npm ci --prefix server
npm run multiplayer
```

In another terminal, start the website with `npm run dev`. Open `/play/raft/` in two browser tabs or windows, choose online play, create a room, and join it with the room code. Pick a Pokémon and mark each player ready to start.

When the site runs on localhost, the client uses `ws://localhost:8787/raft` unless `NEXT_PUBLIC_RAFT_WS_URL` is set. The server exposes `http://localhost:8787/health` for health checks. Run `npm run test:raft:online` for the room and WebSocket integration checks.

For another device on your network, set `NEXT_PUBLIC_RAFT_WS_URL` in `.env.local` to `ws://<your-computer-LAN-IP>:8787/raft`, start Next.js with `npm run dev -- --hostname 0.0.0.0`, and add `http://<your-computer-LAN-IP>:3000` to the server's allowed origins. Restart both processes after changing their configuration.

## Publish the game server

The included [Render Blueprint](../render.yaml) creates a Node web service with a health check, a Free instance, and automatic server deployments disabled. Import this repository as a Blueprint in Render and review the service before deploying. Keep the working directory at the repository root because the server imports shared files from `lib/`. The [Blueprint reference](https://render.com/docs/blueprint-spec) describes these settings, and [Node version configuration](https://render.com/docs/node-version) explains the pinned runtime.

Render supports public WebSocket connections using `wss://`. After deployment, check `https://<service>.onrender.com/health`; the game endpoint is `wss://<service>.onrender.com/raft`. See [WebSockets on Render](https://render.com/docs/websocket).

The Free instance can sleep after 15 minutes without inbound traffic and take about a minute to wake. A sleeping or restarted instance loses this game's in-memory rooms. See [Render Free service limits](https://render.com/docs/free). Deploy server updates manually when no matches need to be preserved.

Any host that supports a persistent Node process and WebSocket upgrades also works. Its build and start commands are:

```sh
npm ci --omit=dev --prefix server
node --experimental-strip-types server/raft-server.mjs
```

For a container host, build from the repository root:

```sh
docker build -f server/Dockerfile -t poke-raft .
docker run --rm -p 8787:8787 -e RAFT_ALLOWED_ORIGINS=https://monqzxc.github.io poke-raft
```

The Dockerfile-specific ignore file keeps the build context limited to the game server and its shared rules. Put the container behind the host's HTTPS endpoint and route WebSocket upgrades to `/raft`.

## Connect GitHub Pages

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
2. Add the repository variable `NEXT_PUBLIC_RAFT_WS_URL` with the public endpoint, for example `wss://<service>.onrender.com/raft`.
3. Run the existing Pages deployment workflow again. Next.js embeds this public URL during the build, so changing the variable requires rebuilding the site.
4. Open `/play/raft/` on the published site in two browsers and create/join a room.

Online play on the published website remains unavailable until a server is deployed and this variable is included in a new Pages build. Local two-player and AI modes continue to work without a server. The endpoint is public configuration; it contains no credentials.

## Server configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | Interface to listen on. |
| `PORT` | `8787` | HTTP and WebSocket port; managed hosts may supply this. |
| `RAFT_ALLOWED_ORIGINS` | Localhost ports 3000/3100 and `https://monqzxc.github.io` | Comma-separated browser origins allowed to connect. |

Use exact origins with the scheme and any nonstandard port, without a path or trailing slash. A custom domain must be added to this list. The Render Blueprint uses only `https://monqzxc.github.io`; add local origins there if development browsers must connect to the hosted server. Environment variables for the standalone server come from its process environment; Next.js `.env.local` configures the website only.

## Match timing and recovery

The server owns the match state and enforces whose turn it is, shot results, and the 120-second turn deadline. Both browsers receive the same state. When time expires, that player's turn is skipped. Both players must be ready before the first turn starts, and both must agree before a rematch begins.

A disconnected player has 30 seconds to reconnect before forfeiting; the turn clock keeps running during that window. A session token stored in the same tab's `sessionStorage` lets it reclaim its seat after a connection interruption or refresh. This is temporary room recovery; it does not save matches permanently.

Run exactly one server instance. Rooms live in memory and are lost whenever the process restarts, redeploys, or sleeps. Inactive rooms expire after two hours. Multiple instances would need shared room storage and coordination before players could reliably connect to the same match.
