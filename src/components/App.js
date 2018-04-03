import React, { Component, createRef } from "react";
import styled from "styled-components";
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
  NEW_ROW_INTERVAL,
  NUM_COLUMNS,
  STARTING_ROWS
} from "../gameConstants";
import DimensionsContext from "./DimensionsContext";
import Timer from "./Timer";
import Player from "./Player";
import Block from "./Block";

const GUTTER = 2;
const REMOVAL_DELAY = 150;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
`;

const Columns = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
`;

const Column = styled.div`
  background-color: #eee;
  & + & {
    margin-left: ${GUTTER}px;
  }
`;

const PlayerArea = styled.div`
  flex-shrink: 0;
  padding: 10px 0;
`;

const PlayerContainer = styled.div`
  width: ${100 / NUM_COLUMNS}%;
  transform: translate3d(${props => props.position * 100}%, 0, 0);
  display: flex;
  justify-content: center;
`;

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
  dimensions: { blockWidth: 0, columnHeight: 0 }
});

class App extends Component {
  constructor() {
    super();

    this.containerRef = createRef();
    this.columnsRef = createRef();
    this.state = getInitialState();
  }

  componentDidMount() {
    const blockWidth =
      (this.containerRef.current.offsetWidth - GUTTER * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS;
    const columnHeight = this.columnsRef.current.offsetHeight;
    this.setState(state => ({
      ...state,
      dimensions: { ...state.dimensions, blockWidth, columnHeight }
    }));
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

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
    const { position, lost, dimensions, blocks } = this.state;
    const isHolding = blocks.some(block => block.held);

    return (
      <DimensionsContext.Provider value={dimensions}>
        <Container innerRef={this.containerRef}>
          {!lost && (
            <Timer onAddNewRow={this.addNewRow} interval={NEW_ROW_INTERVAL} />
          )}
          {lost && (
            <div>
              You lost. <button onClick={this.restart}>Restart</button>
            </div>
          )}
          <Columns innerRef={this.columnsRef}>
            {[...Array(NUM_COLUMNS)].map((_, columnIndex) => (
              <Column
                key={columnIndex}
                onClick={() => this.handleClickColumn(columnIndex)}
                style={{ width: dimensions.blockWidth }}
              />
            ))}
            {blocks.map(({ id, row, column, color, held }) => (
              <Block
                key={id}
                row={row}
                column={held ? position : column}
                color={color}
                held={held}
              />
            ))}
          </Columns>
          <PlayerArea>
            <PlayerContainer position={position}>
              <Player isHolding={isHolding} />
            </PlayerContainer>
          </PlayerArea>
        </Container>
      </DimensionsContext.Provider>
    );
  }
}

export default App;
