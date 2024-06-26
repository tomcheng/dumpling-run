import React, { createRef, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  NUM_COLUMNS,
  GUTTER,
  GAME_AREA_BORDER,
  MINIMUM_SCREEN_PADDING,
  COLORS,
  BLOCK_HEIGHT,
  NEW_ROW_INTERVAL,
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
        column: PropTypes.number,
      })
    ).isRequired,
    blocksForNextChili: PropTypes.number.isRequired,
    blockWidth: PropTypes.number.isRequired,
    blocksToClearLevel: PropTypes.number.isRequired,
    character: PropTypes.string.isRequired,
    gameWidth: PropTypes.number.isRequired,
    heldBlockIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    level: PropTypes.number.isRequired,
    levelCleared: PropTypes.bool.isRequired,
    lost: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    position: PropTypes.number.isRequired,
    resetTimer: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired,
    wallDamages: PropTypes.objectOf(PropTypes.number).isRequired,
    onAddNewRow: PropTypes.func.isRequired,
    onClearResetTimer: PropTypes.func.isRequired,
    onClickColumn: PropTypes.func.isRequired,
    onFastForward: PropTypes.func.isRequired,
    onNewLevel: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
    onRestart: PropTypes.func.isRequired,
    onResume: PropTypes.func.isRequired,
  };

  gameAreaRef = createRef();

  state = { gameHeight: 0, touched: false };

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
      blocksForNextChili,
      blocksToClearLevel,
      blockWidth,
      character,
      gameWidth,
      heldBlockIds,
      level,
      levelCleared,
      lost,
      paused,
      position,
      resetTimer,
      score,
      wallDamages,
      onAddNewRow,
      onChangeCharacter,
      onClearResetTimer,
      onClickColumn,
      onFastForward,
      onNewLevel,
      onPause,
      onRemoveBlock,
      onRestart,
      onResume,
    } = this.props;
    const { gameHeight, touched, isCharacterModalOpen } = this.state;

    const isHolding = heldBlockIds.length > 0;
    const blockHeight = BLOCK_HEIGHT(blockWidth, gameHeight, character);

    return (
      <Container>
        <GameHeader
          blocksForNextChili={blocksForNextChili}
          blocksToClearLevel={blocksToClearLevel}
          gameWidth={gameWidth}
          level={level}
          levelCleared={levelCleared}
          score={score}
          onFastForward={onFastForward}
          onPause={onPause}
        />
        <GameContainer style={{ width: gameWidth }}>
          <Timer
            interval={NEW_ROW_INTERVAL(level)}
            paused={paused || levelCleared || lost}
            resetTimer={resetTimer}
            onAddNewRow={onAddNewRow}
            onClearResetTimer={onClearResetTimer}
          />
          <GameArea ref={this.gameAreaRef}>
            <Columns>
              {[...Array(NUM_COLUMNS)].map((_, columnIndex) => (
                <Column
                  key={columnIndex}
                  onClick={() => {
                    if (!touched) {
                      onClickColumn(columnIndex);
                    }
                  }}
                  onTouchStart={(evt) => {
                    evt.preventDefault();
                    onClickColumn(columnIndex);
                    this.setState({ touched: true });
                  }}
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
                character={character}
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
              character={character}
              isHolding={isHolding}
              position={position}
              blockWidth={blockWidth}
            />
          </GameArea>
        </GameContainer>
        <GameOver
          lost={lost}
          level={level}
          score={score}
          onRestart={onRestart}
        />
        <GamePaused
          blockWidth={blockWidth}
          character={character}
          paused={paused}
          onChangeCharacter={onChangeCharacter}
          onResume={onResume}
        />
        <LevelComplete
          levelCleared={levelCleared}
          onNewLevel={onNewLevel}
          boardCleared={blocks.length === 0}
        />
      </Container>
    );
  }
}

export default App;
