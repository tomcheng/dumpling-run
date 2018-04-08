import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  GUTTER,
  getCharacterSize,
  getCharacterVerticalOffset
} from "../gameConstants";
import Dumpling from "./Dumpling";
import DumplingActive from "./DumplingActive";

const Container = styled.div`
  position: absolute;
  transition: transform 0.07s ease-in-out;
  pointer-events: none;
`;

const Player = ({ isHolding, position, blockWidth }) => (
  <Container
    style={{
      left: 0,
      bottom: getCharacterVerticalOffset(blockWidth),
      transform: `translate3d(${Math.round(
        GUTTER +
          position * (blockWidth + GUTTER) +
          (blockWidth - getCharacterSize(blockWidth)) / 2
      )}px, 0, 0)`
    }}
  >
    {isHolding ? (
      <DumplingActive width={getCharacterSize(blockWidth)} />
    ) : (
      <Dumpling width={getCharacterSize(blockWidth)} />
    )}
  </Container>
);

Player.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  isHolding: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired
};

export default Player;
