# Crypto Arcade

A self-contained React, TypeScript, Vite, and Phaser 3 match-three arcade game. Coin art and chiptune audio are generated in the browser; there are no remotely hosted images, fonts, or audio files.

## Open the game directly

Double-click `index.html`. It is a standalone build with the game code, styling, graphics, and audio embedded in one file. It works without a local server or network connection.

## Run locally

To work on the source code, install Node.js 20.19+ or 22.12+, then run:

```sh
pnpm install
pnpm dev
```

Open the `/dev.html` URL printed by Vite. `pnpm build` regenerates the standalone `index.html`. The engine test suite runs with `pnpm test`.

## Controls

Select a coin, then an adjacent coin to swap. Invalid moves return to their original state. Use the pause button under the board to freeze a round. Sound preferences and personal best are stored in local storage.
