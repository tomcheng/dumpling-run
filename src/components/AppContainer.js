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
        color: sample(keys(COLORS)),
        held: false
      });
    }
  }

  return blocks;
};

const getInitialState = () => ({
  position: Math.floor(NUM_COLUMNS / 2),
  holding: [],
  blocks: generateBlocks(),
  lost: false,
  dimensions: {
    screenWidth: 0,
    screenHeight: 0,
    blockWidth: 0,
    gameWidth: 0,
    gameHeight: 0
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
    const {
      offsetWidth: screenWidth,
      offsetHeight: screenHeight
    } = this.containerRef.current;
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
        screenWidth,
        screenHeight,
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

  toggle = () => {
    if (this.state.blocks.some(block => block.held)) {
      this.drop();
    } else {
      this.pick();
    }
  };

  pick = () => {
    this.setState(state => {
      const { blocks } = state;

      const currentColumn = this.getCurrentColumn(state);

      if (currentColumn.length === 0) {
        return state;
      }

      const { color } = last(currentColumn);

      const idsToHold = takeRightWhile(
        currentColumn,
        block => block.color === color
      ).map(block => block.id);

      let holdRow = idsToHold.length - 1;

      const newBlocks = blocks.map(
        block =>
          idsToHold.includes(block.id)
            ? { ...block, held: true, column: null, row: holdRow-- }
            : block
      );

      return { ...state, blocks: newBlocks };
    });
  };

  drop = () => {
    this.setState(
      state => {
        const { blocks, position } = state;

        const lastRow = this.getCurrentColumn(state).length - 1;
        const numHeld = blocks.filter(block => block.held).length;

        const newBlocks = blocks.map(
          block =>
            block.held
              ? {
                  ...block,
                  held: false,
                  column: position,
                  row: lastRow + numHeld - block.row
                }
              : block
        );
        return { ...state, blocks: newBlocks };
      },
      () => {
        setTimeout(() => {
          this.findAdjacentBlocks();
        }, REMOVAL_DELAY);
      }
    );
  };

  getCurrentColumn = (state = this.state) =>
    sortBy(state.blocks.filter(({ column }) => column === state.position), [
      "row"
    ]);

  findAdjacentBlocks = () => {
    const { blocks } = this.state;
    const adjacentBlockIds = getAdjacents(
      blocks,
      last(this.getCurrentColumn()).id
    );

    if (adjacentBlockIds.length >= 4) {
      this.setState(state => {
        const newBlocks = state.blocks.filter(
          block => !adjacentBlockIds.includes(block.id)
        );

        for (let i = 0; i < NUM_COLUMNS; i++) {
          const column = sortBy(
            newBlocks.filter(({ column }) => column === i),
            ["row"]
          );
          column.forEach((block, index) => {
            if (block.row !== index) {
              const blockIndex = findIndex(
                newBlocks,
                ({ id }) => id === block.id
              );
              newBlocks[blockIndex] = { ...block, row: index };
            }
          });
        }

        return {
          ...state,
          points: state.points + adjacentBlockIds.length * POINTS_PER_BLOCK,
          blocks: newBlocks
        };
      });
    }
  };

  addNewRow = () => {
    this.setState(state => {
      let lastId = state.blocks.length > 0 ? last(state.blocks).id : 0;
      const newBlocks = state.blocks
        .map(block => ({
          ...block,
          row: block.held ? block.row : block.row + 1
        }))
        .concat(
          [...Array(NUM_COLUMNS)].map((_, index) => ({
            id: ++lastId,
            row: 0,
            column: index,
            color: sample(keys(COLORS)),
            held: false
          }))
        );

      return {
        ...state,
        blocks: newBlocks
      };
    }, this.checkLose);
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
    const { position, lost, dimensions, blocks, points } = this.state;

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
            onAddNewRow={this.addNewRow}
            onClickColumn={this.handleClickColumn}
            onRestart={this.restart}
          />
        </DimensionsContext.Provider>
      </div>
    );
  }
}

export default AppContainer;
