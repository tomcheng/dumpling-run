import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { COLORS, BLOCK_BORDER_WIDTH } from "../gameConstants";
import Transition from "react-transition-group/Transition";

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: ${COLORS.background};
  transition: opacity 400ms ease-in-out 800ms;
  z-index: -1;
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 30px;
  font-weight: bold;
  margin-bottom: 5px;
  transition: opacity 400ms ease-in-out 1600ms;
`;

const Score = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
  transition: opacity 400ms ease-in-out 2400ms;
`;

const Button = styled.div`
  font-weight: bold;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown};
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
  transition: opacity 400ms ease-in-out 3200ms;
`;

const GameOver = ({ lost, finalScore, onRestart }) => (
  <Transition in={lost} timeout={0}>
    {state =>
      ["entering", "entered"].includes(state) && (
        <Container>
          <Overlay style={{ opacity: state === "entered" ? 0.9 : 0 }} />
          <Title style={{ opacity: state === "entered" ? 1 : 0 }}>
            Game Over
          </Title>
          <Score style={{ opacity: state === "entered" ? 1 : 0 }}>
            Final Score: {finalScore}
          </Score>
          <Button
            style={{ opacity: state === "entered" ? 1 : 0 }}
            onClick={onRestart}
          >
            Play Again
          </Button>
        </Container>
      )
    }
  </Transition>
);

GameOver.propTypes = {
  finalScore: PropTypes.number.isRequired,
  lost: PropTypes.bool.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default GameOver;
