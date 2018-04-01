import React, { Component } from "react";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import keys from "lodash/keys";
import last from "lodash/last";
import sample from "lodash/sample";
import takeRightWhile from "lodash/takeRightWhile";
import { getAdjacents } from "./utils/gridUtils";

const NUM_COLUMNS = 10;
const GUTTER = 2;
const COLORS = {
  red: { hex: "#cc0000" },
  green: { hex: "#69a84e" },
  blue: { hex: "#3b78d8" },
  yellow: { hex: "#d0d14d" }
};

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

const Block = styled.div`
  height: 30px;
  & + & {
    margin-top: ${GUTTER}px;
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

const Player = styled.div`
  background-color: red;
  width: 50px;
  height: 50px;
`;

const generateColumns = () =>
  [...Array(NUM_COLUMNS)].map(() => [
    sample(keys(COLORS)),
    sample(keys(COLORS)),
    sample(keys(COLORS))
  ]);

class App extends Component {
  state = {
    position: Math.floor(NUM_COLUMNS / 2),
    holding: [],
    columns: generateColumns()
  };

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

  handleKeyDown = evt => {
    switch (evt.code) {
      case "Space":
        if (this.state.holding.length > 0) {
          this.drop();
        } else {
          this.pick();
        }
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

  render() {
    const { position, columns } = this.state;

    return (
      <Container>
        <Columns>
          {columns.map((column, columnIndex) => (
            <Column key={columnIndex}>
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
            <Player />
          </PlayerContainer>
        </PlayerArea>
      </Container>
    );
  }
}

export default App;
