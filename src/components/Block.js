import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import { COLORS, GUTTER } from "../gameConstants";
import { INK_COLOR } from "../utils/colors";
import Dimensions from "./DimensionsContext";

const BLOCK_HEIGHT = 24;
const HOLDING_OFFSET = -42;

const StyledBlock = styled.div`
  position: absolute;
  height: ${BLOCK_HEIGHT}px;
  transition: transform 0.1s ease-in-out;
  z-index: 1;
  pointer-events: none;
  border: 2px solid ${INK_COLOR};
  border-radius: 2px;
`;

const Block = ({ color, column, row, held }) => (
  <Dimensions.Consumer>
    {({ screenHeight, blockWidth }) => (
      <StyledBlock
        style={{
          width: blockWidth,
          backgroundColor: COLORS[color].hex,
          left: column * (blockWidth + GUTTER),
          transform: `translate3d(0, ${
            held
              ? screenHeight +
                HOLDING_OFFSET -
                (row + 1) * (BLOCK_HEIGHT + GUTTER)
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
  row: PropTypes.number.isRequired
};

export default Block;
