import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import keys from "lodash/keys";
import {
  COLORS,
  GUTTER,
  BLOCK_BORDER_WIDTH,
  GAME_AREA_BORDER,
  BLOCK_MOVE_DURATION,
  BLOCK_DISAPPEAR_DURATION,
  BLOCK_DISAPPEAR_BLINK_COUNT,
  getCharacterHoldPosition
} from "../gameConstants";
import Transition from "react-transition-group/Transition";
import Dimensions from "./DimensionsContext";
import Wall from "./Wall";

const blink = keyframes`
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
`;

const StyledBlock = styled.div`
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown.hex};
  border-radius: 2px;
  ${props =>
    props.exiting
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
`;

const StyledWall = styled(Wall)`
  pointer-events: none;
  ${props =>
    props.exiting
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
`;

const getPositionStyles = ({
  blockWidth,
  blockHeight,
  column,
  gameHeight,
  held,
  holdPosition,
  row
}) => ({
  position: "absolute",
  transition: `transform ${BLOCK_MOVE_DURATION}ms ease-out`,
  zIndex: 1,
  width: blockWidth,
  height: blockHeight,
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
});

const Block = ({
  color,
  column,
  row,
  held,
  isWall,
  holdPosition,
  toRemove,
  onRemoved
}) => {
  return (
    <Dimensions.Consumer>
      {({ gameHeight, blockWidth, blockHeight }) => (
        <Transition
          timeout={0}
          in={!toRemove}
          addEndListener={node => {
            node.addEventListener("animationend", onRemoved);
          }}
        >
          {state =>
            isWall ? (
              <StyledWall
                exiting={state === "exited"}
                style={{
                  ...getPositionStyles({
                    blockWidth,
                    blockHeight,
                    column,
                    gameHeight,
                    held,
                    holdPosition,
                    row
                  })
                }}
              />
            ) : (
              <StyledBlock
                exiting={state === "exited"}
                style={{
                  ...getPositionStyles({
                    blockWidth,
                    blockHeight,
                    column,
                    gameHeight,
                    held,
                    holdPosition,
                    row
                  }),
                  backgroundColor: COLORS[color].hex
                }}
              />
            )
          }
        </Transition>
      )}
    </Dimensions.Consumer>
  );
};

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired,
  column: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  isWall: PropTypes.bool.isRequired,
  toRemove: PropTypes.bool.isRequired,
  onRemoved: PropTypes.func.isRequired,
  holdPosition: PropTypes.number,
  row: PropTypes.number
};

export default Block;
