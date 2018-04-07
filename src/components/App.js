import React, { createRef, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  NEW_ROW_INTERVAL,
  NUM_COLUMNS,
  GUTTER,
  GAME_AREA_BORDER,
  MINIMUM_SCREEN_PADDING,
  COLORS
} from "../gameConstants";
import Dimensions from "./DimensionsContext";
import Timer from "./Timer";
import Player from "./Player";
import Block from "./Block";

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fbf6ea;
  padding: ${MINIMUM_SCREEN_PADDING}px 0;
  font-size: 14px;
  line-height: 20px;
  font-family: Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: ${COLORS.brown.hex};
`;

const Header = styled.div`
  padding-bottom: ${MINIMUM_SCREEN_PADDING}px;
`;

const GameArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: ${GAME_AREA_BORDER}px solid #4c3d30;
  padding: ${GUTTER}px;
  position: relative;
`;

const Columns = styled.div`
  flex-grow: 1;
  display: flex;
`;

const Column = styled.div`
  flex-grow: 1;
  & + & {
    margin-left: ${GUTTER}px;
  }
`;

class App extends Component {
  static propTypes = {
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        held: PropTypes.bool.isRequired,
        removed: PropTypes.isRequired,
        column: PropTypes.number,
        holdPosition: PropTypes.number,
        row: PropTypes.number
      })
    ).isRequired,
    blockIdsToRemove: PropTypes.arrayOf(PropTypes.number).isRequired,
    lost: PropTypes.bool.isRequired,
    points: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    onAddNewRow: PropTypes.func.isRequired,
    onClickColumn: PropTypes.func.isRequired,
    onRemovedBlock: PropTypes.func.isRequired,
    onRestart: PropTypes.func.isRequired
  };

  gameAreaRef = createRef();

  state = { gameHeight: 0 };

  componentDidMount() {
    this.setDimensions();
    window.addEventListener("resize", this.setDimensions);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.setDimensions);
  }

  setDimensions = () => {
    this.setState({ gameHeight: this.gameAreaRef.current.offsetHeight });
  };

  render() {
    const {
      blocks,
      lost,
      position,
      onAddNewRow,
      onClickColumn,
      onRemovedBlock,
      onRestart,
      points,
      blockIdsToRemove
    } = this.props;
    const { gameHeight } = this.state;

    const isHolding = blocks.some(block => block.held);

    return (
      <Dimensions.Consumer>
        {({ gameWidth, ...otherDimensions }) => (
          <Container>
            <Header style={{ width: gameWidth }}>
              Score: <strong>{points}</strong>
            </Header>
            <GameArea style={{ width: gameWidth }} innerRef={this.gameAreaRef}>
              <Dimensions.Provider
                value={{ ...otherDimensions, gameWidth, gameHeight }}
              >
                {!lost && (
                  <Timer
                    onAddNewRow={onAddNewRow}
                    interval={NEW_ROW_INTERVAL}
                  />
                )}
                {lost && (
                  <div>
                    You lost. <button onClick={onRestart}>Restart</button>
                  </div>
                )}
                <Columns>
                  {[...Array(NUM_COLUMNS)].map((_, columnIndex) => (
                    <Column
                      key={columnIndex}
                      onClick={() => onClickColumn(columnIndex)}
                    />
                  ))}
                </Columns>
                {blocks.map(
                  ({ id, row, column, color, held, holdPosition, removed }) => (
                    <Block
                      key={id}
                      column={held ? position : column}
                      color={color}
                      row={row}
                      holdPosition={holdPosition}
                      held={held}
                      toRemove={blockIdsToRemove.includes(id)}
                      onRemoved={onRemovedBlock}
                    />
                  )
                )}
                <Player isHolding={isHolding} position={position} />
              </Dimensions.Provider>
            </GameArea>
          </Container>
        )}
      </Dimensions.Consumer>
    );
  }
}

export default App;
