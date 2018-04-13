import React, { createRef, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  NEW_ROW_INTERVAL,
  NUM_COLUMNS,
  GUTTER,
  GAME_AREA_BORDER,
  MINIMUM_SCREEN_PADDING,
  COLORS,
  getBlockHeight
} from "../gameConstants";
import GameHeader from "./GameHeader";
import Timer from "./Timer";
import Player from "./Player";
import Block from "./Block";
import GameOver from "./GameOver";
import GamePaused from "./GamePaused";
import LevelComplete from "./LevelComplete";

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${COLORS.background};
  padding: ${MINIMUM_SCREEN_PADDING}px 0;
  font-size: 14px;
  line-height: 20px;
  font-family: Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: ${COLORS.brown};
`;

const GameContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  border: ${GAME_AREA_BORDER}px solid #4c3d30;
  padding: ${GUTTER}px;
`;

const GameArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
    blockIdsToRemove: PropTypes.arrayOf(PropTypes.number).isRequired,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        column: PropTypes.number
      })
    ).isRequired,
    blocksBeforeNextChili: PropTypes.number.isRequired,
    blocksCleared: PropTypes.number.isRequired,
    blockWidth: PropTypes.number.isRequired,
    boardsCleared: PropTypes.number.isRequired,
    gameWidth: PropTypes.number.isRequired,
    heldBlockIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    level: PropTypes.number.isRequired,
    levelComplete: PropTypes.bool.isRequired,
    lost: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    position: PropTypes.number.isRequired,
    resetTimer: PropTypes.bool.isRequired,
    wallDamages: PropTypes.objectOf(PropTypes.number).isRequired,
    onAddNewRow: PropTypes.func.isRequired,
    onClearResetTimer: PropTypes.func.isRequired,
    onClickColumn: PropTypes.func.isRequired,
    onFastForward: PropTypes.func.isRequired,
    onNewLevel: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
    onRestart: PropTypes.func.isRequired,
    onResume: PropTypes.func.isRequired
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
      blockIdsToRemove,
      blocks,
      blocksBeforeNextChili,
      blocksCleared,
      blockWidth,
      boardsCleared,
      gameWidth,
      heldBlockIds,
      level,
      levelComplete,
      lost,
      paused,
      position,
      resetTimer,
      wallDamages,
      onAddNewRow,
      onClearResetTimer,
      onClickColumn,
      onFastForward,
      onNewLevel,
      onPause,
      onRemoveBlock,
      onRestart,
      onResume
    } = this.props;
    const { gameHeight } = this.state;

    const isHolding = heldBlockIds.length > 0;
    const blockHeight = getBlockHeight(blockWidth, gameHeight);

    return (
      <Container>
        <GameHeader
          blocksBeforeNextChili={blocksBeforeNextChili}
          gameWidth={gameWidth}
          level={level}
          levelComplete={levelComplete}
          onFastForward={onFastForward}
          onPause={onPause}
        />
        <GameContainer style={{ width: gameWidth }}>
          <Timer
            interval={NEW_ROW_INTERVAL}
            paused={paused || levelComplete || lost}
            resetTimer={resetTimer}
            onAddNewRow={onAddNewRow}
            onClearResetTimer={onClearResetTimer}
          />
          <GameArea innerRef={this.gameAreaRef}>
            <Columns>
              {[...Array(NUM_COLUMNS)].map((_, columnIndex) => (
                <Column
                  key={columnIndex}
                  onClick={() => onClickColumn(columnIndex)}
                />
              ))}
            </Columns>
            {blocks.map(({ id, column, isWall, ...other }) => (
              <Block
                {...other}
                key={id}
                isWall={isWall}
                blockWidth={blockWidth}
                blockHeight={blockHeight}
                column={heldBlockIds.includes(id) ? position : column}
                gameHeight={gameHeight}
                holdPosition={heldBlockIds.indexOf(id)}
                held={heldBlockIds.includes(id)}
                toRemove={blockIdsToRemove.includes(id)}
                wallDamage={isWall ? wallDamages[id] || 0 : null}
                onRemove={onRemoveBlock}
              />
            ))}
            <Player
              isHolding={isHolding}
              position={position}
              blockWidth={blockWidth}
            />
          </GameArea>
        </GameContainer>
        <GameOver
          lost={lost}
          onRestart={onRestart}
          blocksCleared={blocksCleared}
          boardsCleared={boardsCleared}
        />
        <GamePaused paused={paused} onResume={onResume} />
        <LevelComplete
          levelComplete={levelComplete}
          onNewLevel={onNewLevel}
        />
      </Container>
    );
  }
}

export default App;
