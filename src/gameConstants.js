import clamp from "lodash/clamp";
import keys from "lodash/keys";
import omit from "lodash/omit";
import range from "lodash/range";
import sample from "lodash/sample";
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
  background: "#fbf6ea"
};

export const BLOCK_COLORS = keys(omit(COLORS, ["background", "brown"]));

// GAME LOGIC
export const NUM_COLUMNS = 10;
export const STARTING_ROWS = 5;
export const MAX_ROWS = 14;
const CHANCE_OF_WALL_FOR_ROW = 0.2;
const MAX_WALLS = 4;
const CHANCE_OF_CHILI_FOR_ROW = 0.4;

const getNumColors = ({ rowsAdded }) => {
  const rowsBeforeAddingColor = 10;
  const startingColors = 5;

  return Math.min(
    Math.floor(rowsAdded / rowsBeforeAddingColor) + startingColors,
    BLOCK_COLORS.length
  );
};

let blockId = 0;

export const getBlocks = ({ rows, rowsAdded, existingBlocks }) => {
  const numColors = getNumColors({ rowsAdded });
  const newBlocks = [];
  const columnsWithWall = range(NUM_COLUMNS).filter(col =>
    existingBlocks.some(b => b.isWall && b.column === col)
  );

  for (let row = 0; row < rows; row++) {
    const shouldHaveWall =
      Math.random() < CHANCE_OF_WALL_FOR_ROW &&
      columnsWithWall.length < MAX_WALLS;
    const wallColumn = sample(
      range(NUM_COLUMNS).filter(col => !columnsWithWall.includes(col))
    );

    if (shouldHaveWall) {
      columnsWithWall.push(wallColumn);
    }

    const shouldHaveChili = Math.random() < CHANCE_OF_CHILI_FOR_ROW;
    const chiliColumn = sample(
      range(NUM_COLUMNS).filter(
        col => !columnsWithWall.includes(col) && col !== wallColumn
      )
    );

    for (let column = 0; column < NUM_COLUMNS; column++) {
      const isWall = shouldHaveWall && column === wallColumn;
      const isChili = shouldHaveChili && column === chiliColumn;
      newBlocks.push({
        id: ++blockId,
        row,
        column,
        color:
          isWall || isChili ? null : sample(BLOCK_COLORS.slice(0, numColors)),
        isWall,
        isChili
      });
    }
  }

  return newBlocks;
};

// TIMING
export const NEW_ROW_INTERVAL = 15000;
export const BLOCK_MOVE_DURATION = 70;
export const REMOVAL_DELAY = BLOCK_MOVE_DURATION + 10;
export const BLOCK_APPEAR_DURATION = 200;
export const BLOCK_DISAPPEAR_DURATION = 500;
export const BLOCK_DISAPPEAR_BLINK_COUNT = 2;

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
export const TIMER_HEIGHT = 3;
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
