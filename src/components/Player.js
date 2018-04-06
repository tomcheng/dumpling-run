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
import Dimensions from "./DimensionsContext";

const Container = styled.div`
  position: absolute;
  transition: transform 0.07s ease-in-out;
  pointer-events: none;
`;

const Player = ({ isHolding, position }) => (
  <Dimensions.Consumer>
    {({ blockWidth }) => (
      <Container
        style={{
          left: 0,
          bottom: CHARACTER_VERTICAL_OFFSET + GUTTER,
          transform: `translate3d(${Math.round(
            GUTTER +
              position * (blockWidth + GUTTER) +
              (blockWidth - CHARACTER_SIZE) / 2
          )}px, 0, 0)`
        }}
      >
        {isHolding ? (
          <DumplingActive width={CHARACTER_SIZE} />
        ) : (
          <Dumpling width={CHARACTER_SIZE} />
        )}
      </Container>
    )}
  </Dimensions.Consumer>
);

Player.propTypes = {
  isHolding: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired
};

export default Player;
