import isEqual from "lodash/isEqual";

export const getAdjacents = (grid, start) => {
  const inBlock = [];
  const targetValue = grid[start[0]][start[1]];

  const floodFill = (pos) => {
    if (pos[0] < 0 || pos[0] > grid.length - 1) {
      return;
    }

    if (pos[1] < 0 || pos[1] > grid[pos[0]].length - 1) {
      return;
    }

    if (inBlock.some(p => isEqual(p, pos))) {
      return;
    }

    if (grid[pos[0]][pos[1]] !== targetValue) {
      return;
    }

    inBlock.push(pos);

    floodFill([pos[0], pos[1] - 1]);
    floodFill([pos[0], pos[1] + 1]);
    floodFill([pos[0] - 1, pos[1]]);
    floodFill([pos[0] + 1, pos[1]]);
  };

  floodFill(start);

  return inBlock;
};

