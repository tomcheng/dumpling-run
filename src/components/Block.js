import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import {
  BLOCK_COLORS,
  COLORS,
  GUTTER,
  BLOCK_BORDER_WIDTH,
  BLOCK_MOVE_DURATION,
  BLOCK_APPEAR_DURATION,
  BLOCK_DISAPPEAR_DURATION,
  BLOCK_DISAPPEAR_BLINK_COUNT,
  getCharacterHoldPosition
} from "../gameConstants";
import Transition from "react-transition-group/Transition";
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
  transition: transform ${BLOCK_MOVE_DURATION}ms ease-out,
    opacity ${BLOCK_APPEAR_DURATION}ms ease-in-out ${BLOCK_MOVE_DURATION}ms;
  opacity: ${props => (props.state === "entering" ? 0 : 1)};
  ${props =>
    props.state === "exited"
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
  pointer-events: none;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown};
  border-radius: 2px;
`;

const StyledWall = styled(Wall)`
  transition: transform ${BLOCK_MOVE_DURATION}ms ease-out,
    opacity ${BLOCK_APPEAR_DURATION}ms ease-in-out ${BLOCK_MOVE_DURATION}ms;
  opacity: ${props => (props.state === "entering" ? 0 : 1)};
  ${props =>
    props.state === "exited"
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
  pointer-events: none;
`;

const StyledChili = styled(ChiliBlock)`
  transition: transform ${BLOCK_MOVE_DURATION}ms ease-out,
    opacity ${BLOCK_APPEAR_DURATION}ms ease-in-out ${BLOCK_MOVE_DURATION}ms;
  opacity: ${props => (props.state === "entering" ? 0 : 1)};
  ${props =>
    props.state === "exited"
      ? `animation: ${BLOCK_DISAPPEAR_DURATION /
          BLOCK_DISAPPEAR_BLINK_COUNT}ms ${blink} step-end ${BLOCK_DISAPPEAR_BLINK_COUNT}`
      : ""};
  pointer-events: none;
  ${props =>
    props.state === "exited"
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
  blockWidth,
  blockHeight,
  gameHeight,
  toRemove,
  wallDamage,
  onRemoved
}) => {
  const positionStyles = {
    position: "absolute",
    zIndex: 1,
    width: blockWidth,
    height: blockHeight,
    left: column * (blockWidth + GUTTER),
    transform: `translate3d(0, ${
      held
        ? gameHeight -
          getCharacterHoldPosition(blockWidth) -
          (holdPosition + 1) * (blockHeight + GUTTER)
        : row * (blockHeight + GUTTER)
    }px, 0)`
  };

  return (
    <Transition
      timeout={0}
      in={!toRemove}
      appear
      addEndListener={(node, done) => {
        node.addEventListener("animationend", () => {
          onRemoved();
          done();
        });
      }}
    >
      {state => {
        if (isChili) {
          return <StyledChili state={state} style={positionStyles} />;
        }

        if (isWall) {
          return <StyledWall state={state} style={positionStyles} wallDamage={wallDamage} />;
        }

        return (
          <StyledBlock
            state={state}
            style={{
              ...positionStyles,
              backgroundColor: COLORS[color]
            }}
          />
        );
      }}
    </Transition>
  );
};

Block.propTypes = {
  column: PropTypes.number.isRequired,
  blockHeight: PropTypes.number.isRequired,
  blockWidth: PropTypes.number.isRequired,
  gameHeight: PropTypes.number.isRequired,
  held: PropTypes.bool.isRequired,
  isChili: PropTypes.bool.isRequired,
  isWall: PropTypes.bool.isRequired,
  toRemove: PropTypes.bool.isRequired,
  onRemoved: PropTypes.func.isRequired,
  color: PropTypes.oneOf(BLOCK_COLORS),
  holdPosition: PropTypes.number,
  row: PropTypes.number,
  wallDamage: PropTypes.number
};

export default Block;
