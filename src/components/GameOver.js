import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { COLORS, BLOCK_BORDER_WIDTH } from "../gameConstants";
import Modal from "./Modal";

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
  <Modal open={lost} delay={800}>
    <Title>Game Over</Title>
    <Score>Final Score: {finalScore}</Score>
    <Button onClick={onRestart}>Play Again</Button>
  </Modal>
);

GameOver.propTypes = {
  finalScore: PropTypes.number.isRequired,
  lost: PropTypes.bool.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default GameOver;
