import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { GUTTER, CHARACTER_SIZE } from "../gameConstants";
import Dumpling from "./Dumpling";
import DumplingActive from "./DumplingActive";
import Dimensions from "./DimensionsContext";

const Container = styled.div`
  transition: transform 0.07s ease-in-out;
`;

const Player = ({ isHolding, position }) => (
  <Dimensions.Consumer>
    {({ blockWidth }) => (
      <Container
        style={{
          transform: `translate3d(${Math.round(
            position * (blockWidth + GUTTER) + (blockWidth - CHARACTER_SIZE) / 2
          )}px, 10px, 0)`
        }}
      >
        {isHolding ? <DumplingActive /> : <Dumpling />}
      </Container>
    )}
  </Dimensions.Consumer>
);

Player.propTypes = {
  isHolding: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired
};

export default Player;
