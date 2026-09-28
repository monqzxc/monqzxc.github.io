# Poké Raft peer-to-peer multiplayer

Poké Raft now uses [PeerJS](https://peerjs.com/) for browser-to-browser data connections. The site remains a static GitHub Pages export; it does not need your own WebSocket server, Render service, environment variable, or database. PeerJS only provides the public signaling step needed for two browsers to discover each other. The battle state is owned by the player who creates the room and is sent directly to the other browser.

## Play online

Run the site normally with `npm run dev`, or open the published Pages site. Choose **Play online**, create a room, and share the six-letter code or invite link. The other player opens the link, chooses a Pokémon, and taps **I'm ready**. Both browsers need WebRTC support and permission to make a direct connection; no account is required.

The host tab must stay open for the room to remain available. If the guest loses connection, the host keeps the room open for a short reconnect window. Refreshing or closing the host ends that room. Create a new room for another match.

## Local checks

```sh
npm install
npm run typecheck
npm run test:raft
```

The old `server/` WebSocket implementation and `render.yaml` remain in the repository as legacy reference code, but the frontend no longer imports or contacts them. They are not needed to run or publish online play.
