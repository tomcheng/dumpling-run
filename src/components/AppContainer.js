import React, { Component, createRef } from "react";
import findIndex from "lodash/findIndex";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import last from "lodash/last";
import omit from "lodash/omit";
import range from "lodash/range";
import sample from "lodash/sample";
import sortBy from "lodash/sortBy";
import takeRightWhile from "lodash/takeRightWhile";
import times from "lodash/times";
import { getAdjacents } from "../utils/gridUtils";
import { getSavedState, saveState } from "../utils/persistence";
import {
  CHANCE_OF_WALL_FOR_ROW,
  MAX_ROWS,
  NUM_COLUMNS,
  STARTING_ROWS,
  BLOCK_COLORS,
  BLOCKS_BEFORE_NEXT_CHILI,
  BLOCKS_TO_CLEAR_LEVEL,
  GUTTER,
  GAME_AREA_BORDER,
  MAX_WALLS,
  MINIMUM_SCREEN_PADDING,
  NUM_COLORS,
  POINTS_PER_BLOCK,
  POINTS_FOR_CLEARING_BOARD,
  POINTS_FOR_CLEARING_LEVEL,
  REMOVAL_DELAY
} from "../gameConstants";
import App from "./App";

const getBlocks = ({
  rows = 1,
  level = 1,
  existingBlocks = [],
  addChili = false
}) => {
  let blockId = get(last(existingBlocks), "id", 0);
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

    const chiliColumn = sample(
      range(NUM_COLUMNS).filter(
        col => !columnsWithWall.includes(col) && col !== wallColumn
      )
    );

    for (let column = 0; column < NUM_COLUMNS; column++) {
      const isWall = shouldHaveWall && column === wallColumn;
      const isChili = addChili && column === chiliColumn;
      newBlocks.push({
        id: ++blockId,
        row,
        column,
        color:
          isWall || isChili
            ? null
            : sample(BLOCK_COLORS.slice(0, NUM_COLORS(level))),
        isWall,
        isChili
      });
    }
  }

  return newBlocks;
};

const newState = () => ({
  position: Math.floor(NUM_COLUMNS / 2),
  blocks: getBlocks({ rows: STARTING_ROWS }),
  blockIdsToRemove: [],
  heldBlockIds: [],
  wallDamages: {},
  blocksForNextChili: BLOCKS_BEFORE_NEXT_CHILI,
  blocksToClearLevel: BLOCKS_TO_CLEAR_LEVEL(1),
  level: 1,
  rowsAdded: 0,
  score: 0,
  levelCleared: false,
  levelClearedPending: false,
  lost: false,
  paused: false,
  resetTimer: false
});

class AppContainer extends Component {
  containerRef = createRef();
  state = { ...(getSavedState() || newState()), gameWidth: 0, blockWidth: 0 };

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.setDimensions);
  }

  componentDidUpdate() {
    if (this.state.blockIdsToRemove.length > 0) {
      return;
    }

    saveState(this.state);
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.setDimensions);
  }

  setDimensions = () => {
    const { offsetWidth: screenWidth } = this.containerRef.current;
    const blockWidth = Math.floor(
      (screenWidth -
        2 * (GUTTER + GAME_AREA_BORDER + MINIMUM_SCREEN_PADDING) -
        (NUM_COLUMNS - 1) * GUTTER) /
        NUM_COLUMNS
    );
    const gameWidth = blockWidth * NUM_COLUMNS + GUTTER * (NUM_COLUMNS - 1);

    this.setState(state => ({
      ...state,
      blockWidth,
      gameWidth
    }));
  };

  moveLeft = () => {
    this.setState(state => ({
      ...state,
      position: Math.max(state.position - 1, 0)
    }));
  };

  moveRight = () => {
    this.setState(state => ({
      ...state,
      position: Math.min(state.position + 1, NUM_COLUMNS - 1)
    }));
  };

  getCurrentColumn = (state = this.state) => {
    const { blocks, position, heldBlockIds } = state;
    return sortBy(
      blocks.filter(
        ({ column, id }) => column === position && !heldBlockIds.includes(id)
      ),
      ["row"]
    );
  };

  toggle = () => {
    if (this.state.heldBlockIds.length > 0) {
      this.drop();
    } else {
      this.pick();
    }
  };

  pick = () => {
    const currentColumn = this.getCurrentColumn();

    if (currentColumn.length === 0) {
      return;
    }

    const { blockIdsToRemove } = this.state;
    const { color, id, isWall, isChili } = last(currentColumn);

    if (blockIdsToRemove.includes(id) || isWall) {
      return;
    }

    this.setState({
      heldBlockIds: isChili
        ? [id]
        : takeRightWhile(currentColumn, block => block.color === color)
            .map(block => block.id)
            .reverse()
    });
  };

  drop = () => {
    const { blocks, position, heldBlockIds } = this.state;
    const lastRow = this.getCurrentColumn().length - 1;
    const numHeld = heldBlockIds.length;

    const newBlocks = blocks.map(
      block =>
        heldBlockIds.includes(block.id)
          ? {
              ...block,
              column: position,
              row: lastRow + numHeld - heldBlockIds.indexOf(block.id)
            }
          : block
    );

    this.setState(
      { blocks: newBlocks, heldBlockIds: [] },
      () => {
        setTimeout(() => {
          this.setBlocksToBeRemoved();
        }, REMOVAL_DELAY);
      }
    );
  };

  setBlocksToBeRemoved = () => {
    const {
      blocks,
      wallDamages,
      blockIdsToRemove,
      blocksToClearLevel
    } = this.state;
    const currentColumn = this.getCurrentColumn();
    const lastBlock = last(currentColumn);
    const blocksById = keyBy(blocks, block => block.id);
    let newBlockIdsToRemove = [];
    let wallIds = [];

    if (lastBlock.isChili) {
      newBlockIdsToRemove = currentColumn.map(b => b.id);
      wallIds = blocks
        .filter(
          b =>
            b.isWall &&
            [lastBlock.column - 1, lastBlock.column + 1].includes(b.column) &&
            b.row <= lastBlock.row
        )
        .map(b => b.id);
    } else {
      const adjacentBlockAndWallIds = getAdjacents(blocks, lastBlock.id);
      if (
        adjacentBlockAndWallIds.filter(id => !blocksById[id].isWall).length >= 4
      ) {
        adjacentBlockAndWallIds.forEach(id => {
          if (blocksById[id].isWall) {
            wallIds.push(id);
          } else {
            newBlockIdsToRemove.push(id);
          }
        });
      }
    }

    const wallIdsToUpdate = wallIds.filter(id => wallDamages[id] !== 2);
    const wallIdsToRemove = wallIds.filter(id => wallDamages[id] === 2);

    const newWallDamages = wallIdsToUpdate.reduce(
      (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
      wallDamages
    );

    const newIdsToRemove = blockIdsToRemove.concat(
      newBlockIdsToRemove,
      wallIdsToRemove
    );

    this.setState({
      blockIdsToRemove: newIdsToRemove,
      wallDamages: newWallDamages,
      levelClearedPending:
        newIdsToRemove.length === blocks.length ||
        newIdsToRemove.length >= blocksToClearLevel
    });
  };

  handleRemoveBlock = () => {
    const { blocks, blockIdsToRemove, levelClearedPending } = this.state;

    if (blockIdsToRemove.length === 0) {
      return;
    }

    const newBlocks = blocks.filter(
      block => !blockIdsToRemove.includes(block.id)
    );

    for (let i = 0; i < NUM_COLUMNS; i++) {
      const column = sortBy(newBlocks.filter(({ column }) => column === i), [
        "row"
      ]);
      column.forEach((block, index) => {
        if (block.row !== index) {
          const blockIndex = findIndex(newBlocks, ({ id }) => id === block.id);
          newBlocks[blockIndex] = { ...block, row: index };
        }
      });
    }

    this.setState(
      state => ({
        ...state,
        blocks: newBlocks,
        blockIdsToRemove: [],
        blocksForNextChili: Math.max(
          state.blocksForNextChili - blockIdsToRemove.length,
          0
        ),
        blocksToClearLevel: Math.max(
          state.blocksToClearLevel - blockIdsToRemove.length,
          0
        ),
        score: state.score + blockIdsToRemove.length * POINTS_PER_BLOCK,
        wallDamages: omit(state.wallDamages, blockIdsToRemove)
      }),
      () => {
        if (levelClearedPending) {
          this.setState({ levelCleared: true, levelClearedPending: false });
        }
      }
    );
  };

  handleAddNewRow = () => {
    const {
      blocks,
      rowsAdded,
      levelCleared,
      blocksForNextChili,
      level
    } = this.state;

    if (levelCleared) {
      return;
    }

    const addChili = blocksForNextChili === 0;
    const newBlocks = blocks
      .map(block => ({
        ...block,
        row: block.row + 1
      }))
      .concat(getBlocks({ level, existingBlocks: blocks, addChili }));

    this.setState(
      {
        blocks: newBlocks,
        rowsAdded: rowsAdded + 1,
        blocksForNextChili: addChili
          ? BLOCKS_BEFORE_NEXT_CHILI
          : blocksForNextChili
      },
      this.checkLose
    );
  };

  handleNewLevel = () => {
    const { blocks, level, score } = this.state;
    const newLevel = level + 1;
    let newScore = score + POINTS_FOR_CLEARING_LEVEL;

    if (blocks.length === 0) {
      newScore += POINTS_FOR_CLEARING_BOARD;
    }

    this.setState({
      blocks: getBlocks({
        rows: STARTING_ROWS,
        level: newLevel
      }),
      blocksForNextChili: BLOCKS_BEFORE_NEXT_CHILI,
      blocksToClearLevel: BLOCKS_TO_CLEAR_LEVEL(newLevel),
      level: newLevel,
      levelCleared: false,
      resetTimer: true,
      score: newScore
    });
  };

  handleClearResetTimer = () => {
    this.setState({ resetTimer: false });
  };

  checkLose = () => {
    const { blocks, blockIdsToRemove } = this.state;

    if (
      blocks.some(
        block =>
          block.row + 1 > MAX_ROWS && !blockIdsToRemove.includes(block.id)
      )
    ) {
      this.setState({ lost: true });
    }
  };

  handleRestart = () => {
    this.setState(newState());
  };

  handlePause = () => {
    this.setState({ paused: true });
  };

  handleResume = () => {
    this.setState({ paused: false });
  };

  handleFastForward = () => {
    this.setState({ resetTimer: true });
    this.handleAddNewRow();
  };

  handleKeyDown = evt => {
    switch (evt.code) {
      case "Space":
        this.toggle();
        break;
      case "ArrowLeft":
        this.moveLeft();
        break;
      case "ArrowRight":
        this.moveRight();
        break;
      default:
        break;
    }
  };

  handleClickColumn = targetPosition => {
    const { blocks, heldBlockIds, position } = this.state;
    const columnAmounts = times(NUM_COLUMNS, () => 0);
    blocks.forEach(block => {
      if (heldBlockIds.includes(block.id)) {
        return;
      }

      columnAmounts[block.column] += 1;
    });
    const isHolding = heldBlockIds.length > 0;
    let newPosition = isHolding ? position : targetPosition;
    while (newPosition !== targetPosition) {
      const positionToCheck =
        targetPosition > newPosition ? newPosition + 1 : newPosition - 1;
      if (columnAmounts[positionToCheck] + heldBlockIds.length > MAX_ROWS) {
        break;
      }
      newPosition = positionToCheck;
    }

    this.setState(
      state => ({
        ...state,
        position: newPosition
      }),
      () => {
        if (newPosition === targetPosition) {
          this.toggle();
        }
      }
    );
  };

  render() {
    const {
      blockIdsToRemove,
      blocks,
      blocksForNextChili,
      blocksToClearLevel,
      blockWidth,
      gameWidth,
      heldBlockIds,
      level,
      levelCleared,
      lost,
      paused,
      position,
      resetTimer,
      score,
      wallDamages
    } = this.state;

    return (
      <div
        ref={this.containerRef}
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <App
          blockIdsToRemove={blockIdsToRemove}
          blocks={blocks}
          blocksForNextChili={blocksForNextChili}
          blocksToClearLevel={blocksToClearLevel}
          blockWidth={blockWidth}
          gameWidth={gameWidth}
          heldBlockIds={heldBlockIds}
          level={level}
          levelCleared={levelCleared}
          lost={lost}
          paused={paused}
          position={position}
          resetTimer={resetTimer}
          score={score}
          wallDamages={wallDamages}
          onAddNewRow={this.handleAddNewRow}
          onClearResetTimer={this.handleClearResetTimer}
          onClickColumn={this.handleClickColumn}
          onFastForward={this.handleFastForward}
          onNewLevel={this.handleNewLevel}
          onPause={this.handlePause}
          onRestart={this.handleRestart}
          onResume={this.handleResume}
          onRemoveBlock={this.handleRemoveBlock}
        />
      </div>
    );
  }
}

export default AppContainer;
