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

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

const Arrow = styled.div`
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 8px solid ${COLORS.brown};
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
`;

const ThinBar = styled.div`
  background-color: ${COLORS.brown};
  width: 3px;
  height: 16px;
`;

const Bar = styled.div`
  background-color: ${COLORS.brown};
  width: 6px;
  height: 16px;
  & + & {
    margin-left: 3px;
  }
`;

const Icon = styled.div`
  display: flex;
  padding: 5px 15px;
  cursor: pointer;
`;

const GameHeader = ({ gameWidth, points, onFastForward, onPause }) => (
  <Container style={{ width: gameWidth }}>
    <div>
      Score: <strong>{points}</strong>
    </div>
    <Actions>
      <Icon onClick={onFastForward}>
        <Arrow />
        <Arrow />
        <ThinBar />
      </Icon>
      <Icon onClick={onPause}>
        <Bar />
        <Bar />
      </Icon>
    </Actions>
  </Container>
);

GameHeader.propTypes = {
  gameWidth: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  onFastForward: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired
};

export default GameHeader;
