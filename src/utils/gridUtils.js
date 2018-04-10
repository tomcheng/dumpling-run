export const getAdjacents = (blocks, startId) => {
  const adjacentIds = [];
  const startBlock = blocks.find(b => b.id === startId);
  const targetColor = startBlock.color;

  const floodFill = block => {
    if (!block) {
      return;
    }

    if (adjacentIds.includes(block.id)) {
      return;
    }

    if (block.color !== targetColor && !block.isWall) {
      return;
    }

    adjacentIds.push(block.id);

    if (block.isWall) {
      return;
    }

    floodFill(
      blocks.find(b => b.row === block.row + 1 && b.column === block.column)
    );
    floodFill(
      blocks.find(b => b.row === block.row - 1 && b.column === block.column)
    );
    floodFill(
      blocks.find(b => b.row === block.row && b.column === block.column + 1)
    );
    floodFill(
      blocks.find(b => b.row === block.row && b.column === block.column - 1)
    );
  };

  floodFill(startBlock);

  return adjacentIds;
};
