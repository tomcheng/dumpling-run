import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import {
  COLORS,
  GUTTER,
  BLOCK_BORDER_WIDTH,
  GAME_AREA_BORDER,
  CHARACTER_HOLD_POSITION
} from "../gameConstants";
import Dimensions from "./DimensionsContext";

const BLOCK_HEIGHT = 24;

const StyledBlock = styled.div`
  position: absolute;
  height: ${BLOCK_HEIGHT}px;
  transition: transform 0.07s ease-in;
  z-index: 1;
  pointer-events: none;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown.hex};
  border-radius: 2px;
`;

const Block = ({ color, column, row, held, holdPosition }) => (
  <Dimensions.Consumer>
    {({ gameHeight, blockWidth }) => (
      <StyledBlock
        style={{
          width: blockWidth,
          backgroundColor: COLORS[color].hex,
          left: GUTTER + column * (blockWidth + GUTTER),
          transform: `translate3d(0, ${
            held
              ? gameHeight -
                2 * GAME_AREA_BORDER -
                2 * GUTTER -
                CHARACTER_HOLD_POSITION -
                (holdPosition + 1) * (BLOCK_HEIGHT + GUTTER)
              : row * (BLOCK_HEIGHT + GUTTER)
          }px, 0)`
        }}
      />
    )}
  </Dimensions.Consumer>
);

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired,
  column: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  holdPosition: PropTypes.number,
  row: PropTypes.number
};

export default Block;
