import { COLORS } from "../gameConstants";

export const outline = {
  fill: "none",
  stroke: COLORS.brown.hex,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "1.5px"
};

export const hairline = {
  ...outline,
  strokeWidth: "1px"
};

export const thick = {
  ...outline,
  strokeWidth: "3px"
};

export const accent = {
  ...outline,
  fill: COLORS.orange.hex
};

export const filled = {
  fill: COLORS.brown.hex
};
