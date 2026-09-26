export type Game = {
  slug: string;
  name: string;
  description: string;
  players: string;
  category: string;
  artwork: readonly [string, string];
};

export const GAMES_HREF = "/play/";

// Register every new game here to include it in the homepage and games hub.
export const games: readonly Game[] = [
  {
    slug: "raft",
    name: "Poké Raft",
    description:
      "Aim, catch the wind, and battle across the water. Challenge Easy or Hard AI, or take turns with a friend.",
    players: "1–2 players",
    category: "Artillery",
    artwork: ["/images/puzzle/charizard.png", "/images/puzzle/mew.png"],
  },
  {
    slug: "puzzle",
    name: "Pokémon Tile Puzzle",
    description:
      "Slide the tiles into place with eight Pokémon to choose from. Try a 3×3 or 4×4 board and beat your best time.",
    players: "1 player",
    category: "Puzzle",
    artwork: ["/images/puzzle/gengar.png", "/images/puzzle/pikachu.png"],
  },
];

export function gameHref(game: Pick<Game, "slug">) {
  return `${GAMES_HREF}${game.slug}/`;
}
