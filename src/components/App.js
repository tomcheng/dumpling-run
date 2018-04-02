import React, { Component } from "react";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import keys from "lodash/keys";
import last from "lodash/last";
import sample from "lodash/sample";
import takeRightWhile from "lodash/takeRightWhile";
import { getAdjacents } from "../utils/gridUtils";
import {
  COLORS,
  MAX_ROWS,
  NEW_ROW_INTERVAL,
  NUM_COLUMNS,
  STARTING_ROWS
} from "../gameConstants";
import Timer from "./Timer";
import Player from "./Player";
import Block from "./Block";

const GUTTER = 2;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
`;

const Columns = styled.div`
  flex-grow: 1;
  display: flex;
`;

const Column = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
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

const getInitialState = () => ({
  position: Math.floor(NUM_COLUMNS / 2),
  holding: [],
  columns: [...Array(NUM_COLUMNS)].map(() =>
    [...Array(STARTING_ROWS)].map(() => sample(keys(COLORS)))
  ),
  lost: false
});

class App extends Component {
  state = getInitialState();

  componentDidMount() {
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
    if (this.state.holding.length > 0) {
      this.drop();
    } else {
      this.pick();
    }
  };

  pick = () => {
    this.setState(state => {
      const { columns, position } = state;
      const selectedColumn = columns[position];
      const newHolding = takeRightWhile(
        selectedColumn,
        color => color === last(selectedColumn)
      );
      const newColumns = columns.map(
        (column, index) =>
          index === position
            ? column.slice(0, column.length - newHolding.length)
            : column
      );

      return { ...state, columns: newColumns, holding: newHolding };
    });
  };

  drop = () => {
    this.setState(state => {
      const { holding, columns, position } = state;
      const newColumns = columns.map(
        (column, index) =>
          index === position ? column.concat(holding) : column
      );

      return { ...state, columns: newColumns, holding: [] };
    }, this.detectBlock);
  };

  detectBlock = () => {
    const { position, columns } = this.state;

    const coordinates = getAdjacents(columns, [
      position,
      columns[position].length - 1
    ]);

    if (coordinates.length >= 4) {
      const newColumns = columns.map((column, columnIndex) =>
        column.filter(
          (block, blockIndex) =>
            !coordinates.some(c => isEqual(c, [columnIndex, blockIndex]))
        )
      );

      this.setState({ columns: newColumns });
    }
  };

  addNewRow = () => {
    this.setState(
      state => ({
        ...state,
        columns: state.columns.map(column =>
          [sample(keys(COLORS))].concat(column)
        )
      }),
      this.checkLose
    );
  };

  checkLose = () => {
    const { columns } = this.state;

    if (columns.some(column => column.length > MAX_ROWS)) {
      this.setState({ lost: true });
    }
  };

  restart = () => {
    this.setState(getInitialState());
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
    const { position, columns, lost, holding } = this.state;

    return (
      <Container>
        {!lost && (
          <Timer onAddNewRow={this.addNewRow} interval={NEW_ROW_INTERVAL} />
        )}
        {lost && (
          <div>
            You lost. <button onClick={this.restart}>Restart</button>
          </div>
        )}
        <Columns>
          {columns.map((column, columnIndex) => (
            <Column
              key={columnIndex}
              onClick={() => this.handleClickColumn(columnIndex)}
            >
              {column.map((color, blockIndex) => (
                <Block
                  key={blockIndex}
                  style={{ backgroundColor: COLORS[color].hex }}
                />
              ))}
            </Column>
          ))}
        </Columns>
        <PlayerArea>
          <PlayerContainer position={position}>
            <Player holding={holding} />
          </PlayerContainer>
        </PlayerArea>
      </Container>
    );
  }
}

export default App;
