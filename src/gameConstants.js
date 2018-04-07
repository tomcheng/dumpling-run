export const NUM_COLUMNS = 10;
export const STARTING_ROWS = 5;
export const MAX_ROWS = 14;
export const POINTS_PER_BLOCK = 100;
export const POINTS_TO_ADVANCE = 3000;

export const NEW_ROW_INTERVAL = 15000;
export const REMOVAL_DELAY = 150;

export const COLORS = {
  brown: { hex: "#4d3d2f" },
  orange: { hex: "#ee6a29" },
  green: { hex: "#26632d" },
  yellow: { hex: "#e7ea08" },
  red: { hex: "#a51d1a" }
};

export const GUTTER = 1;
export const MINIMUM_SCREEN_PADDING = 8;
export const GAME_AREA_BORDER = 2;
export const BLOCK_BORDER_WIDTH = 2;

export const CHARACTER_SIZE = 64;
export const CHARACTER_VERTICAL_OFFSET = -Math.round(5 / 64 * CHARACTER_SIZE);
export const CHARACTER_HOLD_POSITION = Math.round(34 / 64 * CHARACTER_SIZE) + CHARACTER_VERTICAL_OFFSET;
