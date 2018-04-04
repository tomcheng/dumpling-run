import { INK_COLOR, ACCENT_COLOR } from "./colors";

export const outline = {
  fill: "none",
  stroke: INK_COLOR,
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
  fill: ACCENT_COLOR
};

export const filled = {
  fill: INK_COLOR
};
