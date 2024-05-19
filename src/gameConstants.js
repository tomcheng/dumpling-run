import clamp from "lodash/clamp";
import keys from "lodash/keys";
import omit from "lodash/omit";
import { simpleMemoize } from "./utils/generalUtils";

// COLORS
export const COLORS = {
  orange: "#ee6a29",
  green: "#26632d",
  yellow: "#e7ea08",
  red: "#a51d1a",
  lightBrown: "#c4bc9d",
  blue: "#57abef",
  lightGreen: "#4be34d",
  purple: "#9251fb",
  brown: "#4d3d2f",
  background: "#fbf6ea",
};

export const BLOCK_COLORS = keys(omit(COLORS, ["background", "brown"]));

// GAME LOGIC
export const NUM_COLUMNS = 10;
export const MAX_ROWS = 14;
export const STARTING_ROWS = 5;
export const CHANCE_OF_WALL_FOR_ROW = 0.35;
export const MAX_WALLS = 5;
export const BLOCKS_BEFORE_NEXT_CHILI = 50;

const STARTING_COLORS = 5;
const STARTING_BLOCKS_PER_LEVEL = 120;
const LEVEL_TO_START_DECREASING = 11;
const BLOCKS_PER_LEVEL_DECREASE = 10;
const MINIMUM_BLOCKS_PER_LEVEL = 60;

export const NUM_COLORS = (level) =>
  Math.min(STARTING_COLORS + level - 1, BLOCK_COLORS.length);
export const BLOCKS_TO_CLEAR_LEVEL = (level) =>
  Math.max(
    STARTING_BLOCKS_PER_LEVEL -
      Math.max(level + 1 - LEVEL_TO_START_DECREASING, 0) *
        BLOCKS_PER_LEVEL_DECREASE,
    MINIMUM_BLOCKS_PER_LEVEL
  );

const STARTING_INTERVAL = 15000;
const INTERVAL_DECAY = 0.9;
export const NEW_ROW_INTERVAL = (level) =>
  Math.round(
    STARTING_INTERVAL *
      INTERVAL_DECAY **
        Math.max(level - 1 - BLOCK_COLORS.length + STARTING_COLORS, 0)
  );

// SCORING
export const POINTS_PER_BLOCK = 10;
export const POINTS_FOR_CLEARING_BOARD = 1000;
export const POINTS_FOR_CLEARING_LEVEL = 2000;

// TIMING
export const BLOCK_MOVE_DURATION = 70;
export const REMOVAL_DELAY = BLOCK_MOVE_DURATION + 10;
export const BLOCK_APPEAR_DURATION = 200;
export const BLOCK_DISAPPEAR_DURATION = 500;
export const BLOCK_DISAPPEAR_BLINK_COUNT = 2;

// GAME DIMENSIONS
export const GUTTER = 1;
export const MINIMUM_SCREEN_PADDING = 8;
export const GAME_AREA_BORDER = 2;
export const BLOCK_BORDER_WIDTH = 2;
export const TIMER_HEIGHT = 3;
export const BLOCK_HEIGHT = simpleMemoize(
  (blockWidth, gameHeight, character) =>
    Math.floor(
      (gameHeight -
        2 * GAME_AREA_BORDER -
        2 * GUTTER -
        CHARACTER_HOLD_POSITION({ blockWidth, character })) /
        (MAX_ROWS + 0.2)
    ) - GUTTER
);

// CHARACTER DIMENSIONS
export const CHARACTER_SIZE = simpleMemoize(({ blockWidth, character }) =>
  character === "miseh"
    ? clamp(blockWidth, (50 * 80) / 64, (140 * 80) / 64)
    : clamp(blockWidth, 50, 140)
);
export const CHARACTER_VERTICAL_OFFSET = simpleMemoize(
  ({ blockWidth, character }) =>
    character === "miseh"
      ? -Math.round((5 / 80) * CHARACTER_SIZE({ blockWidth, character }))
      : -Math.round((5 / 64) * CHARACTER_SIZE({ blockWidth, character }))
);
export const CHARACTER_HOLD_POSITION = simpleMemoize(
  ({ blockWidth, character }) =>
    character === "miseh"
      ? Math.round((34 / 80) * CHARACTER_SIZE({ blockWidth, character })) +
        CHARACTER_VERTICAL_OFFSET({ blockWidth, character })
      : Math.round((34 / 64) * CHARACTER_SIZE({ blockWidth, character })) +
        CHARACTER_VERTICAL_OFFSET({ blockWidth, character })
);
