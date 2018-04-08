import clamp from "lodash/clamp";
import keys from "lodash/keys";
import omit from "lodash/omit";
import { simpleMemoize } from "./utils/generalUtils";

// GAME LOGIC
export const NUM_COLUMNS = 10;
export const STARTING_ROWS = 5;
export const MAX_ROWS = 14;
export const POINTS_PER_BLOCK = 100;
export const POINTS_TO_ADVANCE = 3000;
export const CHANCE_OF_WALL = 0.03;
export const CHANCE_OF_CHILI = 0.04;

// TIMING
export const NEW_ROW_INTERVAL = 1500000;
export const BLOCK_MOVE_DURATION = 70;
export const REMOVAL_DELAY = BLOCK_MOVE_DURATION + 10;
export const BLOCK_APPEAR_DURATION = 200;
export const BLOCK_DISAPPEAR_DURATION = 500;
export const BLOCK_DISAPPEAR_BLINK_COUNT = 2;

// COLORS
export const COLORS = {
  brown: "#4d3d2f",
  orange: "#ee6a29",
  green: "#26632d",
  yellow: "#e7ea08",
  red: "#a51d1a",
  background: "#fbf6ea"
};

export const BLOCK_COLORS = keys(omit(COLORS, ["background"]));

// CHARACTER DIMENSIONS
export const getCharacterSize = simpleMemoize(blockWidth =>
  clamp(blockWidth, 50, 140)
);
export const getCharacterVerticalOffset = simpleMemoize(
  blockWidth => -Math.round(5 / 64 * getCharacterSize(blockWidth))
);
export const getCharacterHoldPosition = simpleMemoize(
  blockWidth =>
    Math.round(34 / 64 * getCharacterSize(blockWidth)) +
    getCharacterVerticalOffset(blockWidth)
);

// GAME DIMENSIONS
export const GUTTER = 1;
export const MINIMUM_SCREEN_PADDING = 8;
export const GAME_AREA_BORDER = 2;
export const BLOCK_BORDER_WIDTH = 2;
export const TIMER_HEIGHT = 4;
export const getBlockHeight = simpleMemoize(
  (blockWidth, gameHeight) =>
    Math.floor(
      (gameHeight -
        2 * GAME_AREA_BORDER -
        2 * GUTTER -
        getCharacterHoldPosition(blockWidth)) /
        (MAX_ROWS + 0.5)
    ) - GUTTER
);
