import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MINIMUM_SCREEN_PADDING, COLORS } from "../gameConstants";

const Container = styled.div`
  padding-bottom: ${MINIMUM_SCREEN_PADDING}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const Bar = styled.div`
  background-color: ${COLORS.brown};
  width: 6px;
  height: 16px;
  & + & {
    margin-left: 3px;
  }
`;

const PauseButton = styled.div`
  display: flex;
  padding: 5px;
`;

const GameHeader = ({ gameWidth, points, onPause }) => (
  <Container style={{ width: gameWidth }}>
    <div>
      Score: <strong>{points}</strong>
    </div>
    <PauseButton onClick={onPause}>
      <Bar />
      <Bar />
    </PauseButton>
  </Container>
);

GameHeader.propTypes = {
  gameWidth: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  onPause: PropTypes.func.isRequired
};

export default GameHeader;
