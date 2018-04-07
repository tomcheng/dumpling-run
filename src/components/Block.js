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
import ChiliBlock from "./ChiliBlock";
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
  pointer-events: none;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown};
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

const StyledChili = styled(ChiliBlock)`
  pointer-events: none;
  ${props =>
    props.exiting
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
`;

const Block = ({
  color,
  column,
  row,
  held,
  isChili,
  isWall,
  holdPosition,
  toRemove,
  onRemoved
}) => {
  return (
    <Dimensions.Consumer>
      {({ gameHeight, blockWidth, blockHeight }) => {
        const positionStyles = {
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
        };

        return (
          <Transition
            timeout={0}
            in={!toRemove}
            addEndListener={node => {
              node.addEventListener("animationend", onRemoved);
            }}
          >
            {state => {
              const exiting = state === "exited";

              if (isChili) {
                return <StyledChili exiting={exiting} style={positionStyles} />;
              }

              if (isWall) {
                return <StyledWall exiting={exiting} style={positionStyles} />;
              }

              return (
                <StyledBlock
                  exiting={exiting}
                  style={{
                    ...positionStyles,
                    backgroundColor: COLORS[color]
                  }}
                />
              );
            }}
          </Transition>
        );
      }}
    </Dimensions.Consumer>
  );
};

Block.propTypes = {
  color: PropTypes.oneOf(keys(COLORS)).isRequired,
  column: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  isChili: PropTypes.bool.isRequired,
  isWall: PropTypes.bool.isRequired,
  toRemove: PropTypes.bool.isRequired,
  onRemoved: PropTypes.func.isRequired,
  holdPosition: PropTypes.number,
  row: PropTypes.number
};

export default Block;
