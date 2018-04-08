import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MINIMUM_SCREEN_PADDING } from "../gameConstants";

const Container = styled.div`
  padding-bottom: ${MINIMUM_SCREEN_PADDING}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const GameHeader = ({ gameWidth, points, onPause }) => (
  <Container style={{ width: gameWidth }}>
    <div>
      Score: <strong>{points}</strong>
    </div>
    <div><button onClick={onPause}>Pause</button></div>
  </Container>
);

GameHeader.propTypes = {
  gameWidth: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  onPause: PropTypes.func.isRequired,
};

export default GameHeader;
