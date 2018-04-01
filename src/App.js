import React, { Component } from "react";
import styled from "styled-components";
import last from "lodash/last";
import sample from "lodash/sample";
import takeRightWhile from "lodash/takeRightWhile";

const NUM_COLUMNS = 10;
const GUTTER = 2;
const COLORS = [
  { id: "red", hex: "#cc0000" },
  { id: "green", hex: "#69a84e" },
  { id: "blue", hex: "#3b78d8" },
  { id: "yellow", hex: "#d0d14d" }
];

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
    sample(COLORS),
    sample(COLORS),
    sample(COLORS)
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

  drop = () => {
    this.setState(state => {
      const { holding, columns, position } = state;
      const newColumns = columns.map(
        (column, index) =>
          index === position ? column.concat(holding) : column
      );

      return { ...state, columns: newColumns, holding: [] };
    });
  };

  pick = () => {
    this.setState(state => {
      const { columns, position } = state;
      const selectedColumn = columns[position];
      const newHolding = takeRightWhile(
        selectedColumn,
        ({ id }) => id === last(selectedColumn).id
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
          {[...Array(NUM_COLUMNS)].map((_, index) => (
            <Column key={index}>
              {columns[index].map(({ hex }, blockIndex) => (
                <Block key={blockIndex} style={{ backgroundColor: hex }} />
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
