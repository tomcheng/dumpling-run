import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import { COLORS } from "../gameConstants";
import DimensionsContext from "./DimensionsContext";

const GUTTER = 2;
const HOLDING_OFFSET = 43;

const StyledBlock = styled.div`
  position: absolute;
  height: 30px;
  transition: transform 0.1s ease-in-out;
  z-index: 1;
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
              ? columnHeight + HOLDING_OFFSET - (row + 1) * (30 + GUTTER)
              : row * (30 + GUTTER)
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
