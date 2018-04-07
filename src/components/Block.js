import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import keys from "lodash/keys";
import {
  COLORS,
  GUTTER,
  BLOCK_BORDER_WIDTH,
  GAME_AREA_BORDER,
  BLOCK_MOVE_DURATION,
  BLOCK_DISAPPEAR_DURATION,
  getCharacterHoldPosition
} from "../gameConstants";
import Transition from "react-transition-group/Transition";
import Dimensions from "./DimensionsContext";

const StyledBlock = styled.div`
  position: absolute;
  transition: transform ${BLOCK_MOVE_DURATION}ms ease-out,
    opacity ${BLOCK_DISAPPEAR_DURATION}ms ease-in-out;
  z-index: 1;
  pointer-events: none;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown.hex};
  border-radius: 2px;
`;

const Block = ({
  color,
  column,
  row,
  held,
  holdPosition,
  toRemove,
  onRemoved
}) => (
  <Dimensions.Consumer>
    {({ gameHeight, blockWidth, blockHeight }) => (
      <Transition
        timeout={0}
        in={!toRemove}
        addEndListener={node => {
          node.addEventListener("transitionend", onRemoved);
        }}
      >
        {state => (
          <StyledBlock
            style={{
              opacity: state === "exited" ? 0 : 1,
              width: blockWidth,
              height: blockHeight,
              backgroundColor: COLORS[color].hex,
              left: GUTTER + column * (blockWidth + GUTTER),
              transform: `translate3d(0, ${
                held
                  ? gameHeight -
                    2 * GAME_AREA_BORDER -
                    2 * GUTTER -
                    getCharacterHoldPosition(blockWidth) -
                    (holdPosition + 1) * (blockHeight + GUTTER)
                  : row * (blockHeight + GUTTER)
              }px, 0)`
            }}
          />
        )}
      </Transition>
    )}
  </Dimensions.Consumer>
);

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired,
  column: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  toRemove: PropTypes.bool.isRequired,
  onRemoved: PropTypes.func.isRequired,
  holdPosition: PropTypes.number,
  row: PropTypes.number
};

export default Block;
