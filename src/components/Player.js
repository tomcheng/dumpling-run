import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  GUTTER,
  CHARACTER_SIZE,
  CHARACTER_VERTICAL_OFFSET
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
      bottom: CHARACTER_VERTICAL_OFFSET(blockWidth),
      transform: `translate3d(${Math.round(
        GUTTER +
          position * (blockWidth + GUTTER) +
          (blockWidth - CHARACTER_SIZE(blockWidth)) / 2
      )}px, 0, 0)`
    }}
  >
    {isHolding ? (
      <DumplingActive width={CHARACTER_SIZE(blockWidth)} />
    ) : (
      <Dumpling width={CHARACTER_SIZE(blockWidth)} />
    )}
  </Container>
);

Player.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  isHolding: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired
};

export default Player;
