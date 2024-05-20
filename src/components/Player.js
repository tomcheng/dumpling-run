import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  GUTTER,
  CHARACTER_WIDTH,
  CHARACTER_VERTICAL_OFFSET,
} from "../gameConstants";
import Dumpling from "./Dumpling";
import DumplingActive from "./DumplingActive";

const Container = styled.div`
  position: absolute;
  transition: transform 0.07s ease-in-out;
  pointer-events: none;
`;

const Player = ({ character, isHolding, position, blockWidth }) => (
  <Container
    style={{
      left: 0,
      bottom: CHARACTER_VERTICAL_OFFSET({ blockWidth, character }),
      transform: `translate3d(${Math.round(
        GUTTER +
          position * (blockWidth + GUTTER) +
          (blockWidth - CHARACTER_WIDTH({ blockWidth, character })) / 2
      )}px, 0, 0)`,
    }}
  >
    {isHolding ? (
      <DumplingActive
        width={CHARACTER_WIDTH({ blockWidth, character })}
        character={character}
      />
    ) : (
      <Dumpling
        width={CHARACTER_WIDTH({ blockWidth, character })}
        character={character}
      />
    )}
  </Container>
);

Player.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  isHolding: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
};

export default Player;
