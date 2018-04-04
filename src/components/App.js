import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { NEW_ROW_INTERVAL, NUM_COLUMNS, GUTTER } from "../gameConstants";
import Timer from "./Timer";
import Player from "./Player";
import Block from "./Block";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  background-color: #fbf6ea;
`;

const Columns = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
`;

const Column = styled.div`
  flex-grow: 1;
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

const App = ({
  blocks,
  lost,
  dimensions,
  position,
  onAddNewRow,
  onClickColumn,
  onRestart
}) => {
  const isHolding = blocks.some(block => block.held);

  return (
    <Container>
      {!lost && <Timer onAddNewRow={onAddNewRow} interval={NEW_ROW_INTERVAL} />}
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
  );
};

App.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      row: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      held: PropTypes.bool.isRequired,
      column: PropTypes.number
    })
  ).isRequired,
  lost: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
  onAddNewRow: PropTypes.func.isRequired,
  onClickColumn: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default App;
