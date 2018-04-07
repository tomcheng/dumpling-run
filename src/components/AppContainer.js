import React, { Component, createRef } from "react";
import findIndex from "lodash/findIndex";
import keys from "lodash/keys";
import last from "lodash/last";
import omit from "lodash/omit";
import sample from "lodash/sample";
import sortBy from "lodash/sortBy";
import takeRightWhile from "lodash/takeRightWhile";
import { getAdjacents } from "../utils/gridUtils";
import {
  COLORS,
  MAX_ROWS,
  NUM_COLUMNS,
  STARTING_ROWS,
  GUTTER,
  GAME_AREA_BORDER,
  MINIMUM_SCREEN_PADDING,
  REMOVAL_DELAY,
  POINTS_PER_BLOCK
} from "../gameConstants";
import DimensionsContext from "./DimensionsContext";
import App from "./App";

const generateBlocks = () => {
  const blocks = [];

  for (let column = 0; column < NUM_COLUMNS; column++) {
    for (let row = 0; row < STARTING_ROWS; row++) {
      blocks.push({
        id: 1 + row + column * STARTING_ROWS,
        row,
        column,
        color: sample(keys(COLORS))
      });
    }
  }

  return blocks;
};

const getInitialState = () => ({
  position: Math.floor(NUM_COLUMNS / 2),
  blocks: generateBlocks(),
  blockIdsToRemove: [],
  heldBlockIds: [],
  lost: false,
  dimensions: {
    blockWidth: 0
  },
  points: 0
});

class AppContainer extends Component {
  containerRef = createRef();
  state = getInitialState();

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
    const gameWidth =
      blockWidth * NUM_COLUMNS +
      GUTTER * (NUM_COLUMNS - 1) +
      2 * (GUTTER + GAME_AREA_BORDER);

    this.setState(state => ({
      ...state,
      dimensions: {
        blockWidth,
        gameWidth
      }
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

    const { color } = last(currentColumn);

    this.setState({
      heldBlockIds: takeRightWhile(
        currentColumn,
        block => block.color === color
      ).map(block => block.id)
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
    const { blocks } = this.state;
    const adjacentBlockIds = getAdjacents(
      blocks,
      last(this.getCurrentColumn()).id
    );

    if (adjacentBlockIds.length >= 4) {
      this.setState(state => ({
        ...state,
        blockIdsToRemove: state.blockIdsToRemove.concat(adjacentBlockIds)
      }));
    }
  };

  addNewRow = () => {
    const { blocks } = this.state;
    let lastId = blocks.length > 0 ? last(blocks).id : 0;
    const newBlocks = blocks
      .map(block => ({
        ...block,
        row: block.held ? block.row : block.row + 1
      }))
      .concat(
        [...Array(NUM_COLUMNS)].map((_, index) => ({
          id: ++lastId,
          row: 0,
          column: index,
          color: sample(keys(COLORS))
        }))
      );

    this.setState({ blocks: newBlocks }, this.checkLose);
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

    this.setState(state => ({
      ...state,
      blocks: newBlocks,
      blockIdsToRemove: [],
      points: state.points + blockIdsToRemove.length * POINTS_PER_BLOCK
    }));
  };

  checkLose = () => {
    const { blocks } = this.state;

    if (blocks.some(block => block.row + 1 > MAX_ROWS)) {
      this.setState({ lost: true });
    }
  };

  restart = () => {
    this.setState(omit(getInitialState(), ["dimensions"]));
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

  handleClickColumn = position => {
    this.setState(
      state => ({
        ...state,
        position
      }),
      this.toggle
    );
  };

  render() {
    const {
      position,
      lost,
      dimensions,
      blocks,
      points,
      blockIdsToRemove,
      heldBlockIds
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
        <DimensionsContext.Provider value={dimensions}>
          <App
            points={points}
            blocks={blocks}
            lost={lost}
            position={position}
            blockIdsToRemove={blockIdsToRemove}
            heldBlockIds={heldBlockIds}
            onAddNewRow={this.addNewRow}
            onClickColumn={this.handleClickColumn}
            onRestart={this.restart}
            onRemovedBlock={this.handleRemovedBlock}
          />
        </DimensionsContext.Provider>
      </div>
    );
  }
}

export default AppContainer;
