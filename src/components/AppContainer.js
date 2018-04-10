import React, { Component, createRef } from "react";
import findIndex from "lodash/findIndex";
import keyBy from "lodash/keyBy";
import last from "lodash/last";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import takeRightWhile from "lodash/takeRightWhile";
import times from "lodash/times";
import { getAdjacents } from "../utils/gridUtils";
import {
  MAX_ROWS,
  NUM_COLUMNS,
  STARTING_ROWS,
  ROWS_AFTER_CLEARING_BOARD,
  GUTTER,
  GAME_AREA_BORDER,
  MINIMUM_SCREEN_PADDING,
  REMOVAL_DELAY,
  getBlocks
} from "../gameConstants";
import App from "./App";

const newState = () => ({
  position: Math.floor(NUM_COLUMNS / 2),
  blocks: getBlocks({ rows: STARTING_ROWS, rowsAdded: 0, existingBlocks: [] }),
  blockIdsToRemove: [],
  heldBlockIds: [],
  blocksCleared: 0,
  boardsCleared: 0,
  rowsAdded: 0,
  lost: false,
  paused: false,
  resetTimer: false,
  wallDamages: {}
});

class AppContainer extends Component {
  containerRef = createRef();
  state = { ...newState(), gameWidth: 0, blockWidth: 0 };

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.setDimensions);
  }

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

    this.setState({ blocks: newBlocks, heldBlockIds: [] }, () => {
      setTimeout(() => {
        this.removeMatchedBlocks();
      }, REMOVAL_DELAY);
    });
  };

  removeMatchedBlocks = () => {
    const { blocks, wallDamages } = this.state;
    const lastBlock = last(this.getCurrentColumn());

    if (lastBlock.isChili) {
      this.setState(state => ({
        ...state,
        blockIdsToRemove: state.blockIdsToRemove.concat(
          this.getCurrentColumn().map(b => b.id)
        )
      }));
      return;
    }

    const blocksById = keyBy(blocks, block => block.id);
    const adjacentBlockAndWallIds = getAdjacents(blocks, lastBlock.id);
    const adjacentBlockIds = [];
    const wallIdsToRemove = [];
    const wallIdsToUpdate = [];

    adjacentBlockAndWallIds.forEach(id => {
      const { isWall } = blocksById[id];
      const damage = wallDamages[id];

      if (isWall) {
        if (damage === 2) {
          wallIdsToRemove.push(id);
        } else {
          wallIdsToUpdate.push(id);
        }
      } else {
        adjacentBlockIds.push(id);
      }
    });

    const newWallDamages = wallIdsToUpdate.reduce(
      (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
      wallDamages
    );

    if (adjacentBlockIds.length >= 4) {
      this.setState(state => ({
        ...state,
        blockIdsToRemove: state.blockIdsToRemove.concat(
          adjacentBlockIds,
          wallIdsToRemove
        ),
        wallDamages: newWallDamages
      }));
    }
  };

  handleAddNewRow = () => {
    const { blocks, rowsAdded } = this.state;
    const newBlocks = blocks
      .map(block => ({
        ...block,
        row: block.row + 1
      }))
      .concat(getBlocks({ rows: 1, rowsAdded, existingBlocks: blocks }));

    this.setState(
      { blocks: newBlocks, rowsAdded: rowsAdded + 1 },
      this.checkLose
    );
  };

  handleRemovedBlock = () => {
    const { blocks, blockIdsToRemove } = this.state;

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
        blocksCleared: state.blocksCleared + blockIdsToRemove.length,
        wallDamages: omit(state.wallDamages, blockIdsToRemove)
      }),
      () => {
        if (newBlocks.length === 0) {
          this.handleClearBoard();
        }
      }
    );
  };

  handleClearBoard = () => {
    this.setState(state => ({
      blocks: getBlocks({
        rows: ROWS_AFTER_CLEARING_BOARD,
        rowsAdded: state.rowsAdded,
        existingBlocks: state.blocks
      }),
      boardsCleared: state.boardsCleared + 1,
      resetTimer: true
    }));
  };

  handleClearResetTimer = () => {
    this.setState({ resetTimer: false });
  };

  checkLose = () => {
    const { blocks } = this.state;

    if (blocks.some(block => block.row + 1 > MAX_ROWS)) {
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
      blocksCleared,
      blockWidth,
      boardsCleared,
      gameWidth,
      heldBlockIds,
      lost,
      paused,
      position,
      resetTimer,
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
          blocksCleared={blocksCleared}
          blockWidth={blockWidth}
          boardsCleared={boardsCleared}
          gameWidth={gameWidth}
          heldBlockIds={heldBlockIds}
          lost={lost}
          paused={paused}
          position={position}
          resetTimer={resetTimer}
          wallDamages={wallDamages}
          onAddNewRow={this.handleAddNewRow}
          onClearResetTimer={this.handleClearResetTimer}
          onClickColumn={this.handleClickColumn}
          onFastForward={this.handleFastForward}
          onPause={this.handlePause}
          onRestart={this.handleRestart}
          onResume={this.handleResume}
          onRemovedBlock={this.handleRemovedBlock}
        />
      </div>
    );
  }
}

export default AppContainer;
