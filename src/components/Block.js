import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import { COLORS } from "../gameConstants";
import { INK_COLOR } from "../utils/colors";
import DimensionsContext from "./DimensionsContext";

const BLOCK_HEIGHT = 24;
const GUTTER = 1;
const HOLDING_OFFSET = 42;

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
  <DimensionsContext.Consumer>
    {({ blockWidth, columnHeight }) => (
      <StyledBlock
        style={{
          backgroundColor: COLORS[color].hex,
          width: blockWidth,
          left: column * (blockWidth + GUTTER),
          transform: `translate3d(0, ${
            held
              ? columnHeight + HOLDING_OFFSET - (row + 1) * (BLOCK_HEIGHT + GUTTER)
              : row * (BLOCK_HEIGHT + GUTTER)
          }px, 0)`
        }}
      />
    )}
  </DimensionsContext.Consumer>
);

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired,
  column: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  row: PropTypes.number.isRequired
};

export default Block;
