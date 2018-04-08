import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { COLORS, BLOCK_BORDER_WIDTH } from "../gameConstants";
import Modal from "./Modal";
import Animate from "./Animate";

const Title = styled.div`
  font-size: 24px;
  line-height: 30px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Score = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
`;

const Button = styled.div`
  font-weight: bold;
  border: ${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown};
  border-radius: 2px;
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
`;

const GameOver = ({ lost, finalScore, onRestart }) => (
  <Modal open={lost} delay={800}>
    <Animate start={0} end={1} delay={400} on>
      {opacity => <Title style={{ opacity }}>Game Over</Title>}
    </Animate>
    <Animate start={0} end={1} delay={1200} on>
      {opacity => <Score style={{ opacity }}>Final Score: {finalScore}</Score>}
    </Animate>
    <Animate start={0} end={1} delay={2000} on>
      {opacity => (
        <Button style={{ opacity }} onClick={onRestart}>
          Play Again
        </Button>
      )}
    </Animate>
  </Modal>
);

GameOver.propTypes = {
  finalScore: PropTypes.number.isRequired,
  lost: PropTypes.bool.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default GameOver;
