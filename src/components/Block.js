import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import { COLORS } from "../gameConstants";
import DimensionsContext from "./DimensionsContext";

const StyledBlock = styled.div`
  height: 30px;
  & + & {
    margin-top: 2px;
  }
`;

const Block = ({ color }) => (
  <DimensionsContext.Consumer>
    {({ blockWidth }) => (
      <StyledBlock
        style={{ backgroundColor: COLORS[color].hex, width: blockWidth }}
      />
    )}
  </DimensionsContext.Consumer>
);

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired
};

export default Block;
