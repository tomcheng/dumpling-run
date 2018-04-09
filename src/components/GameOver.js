import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "./Modal";
import Animate from "./Animate";

const Body = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
`;

const GameOver = ({ lost, blocksCleared, boardsCleared, onRestart }) => (
  <Modal open={lost} delay={800}>
    <Animate start={0} end={1} delay={400} on>
      {opacity => <Modal.Title style={{ opacity }}>Game Over</Modal.Title>}
    </Animate>
    <Body>
      <Animate start={0} end={1} delay={1200} on>
        {opacity => <div style={{ opacity }}>Blocks Cleared: {blocksCleared}</div>}
      </Animate>
      <Animate start={0} end={1} delay={2000} on>
        {opacity => <div style={{ opacity }}>Boards Cleared: {boardsCleared}</div>}
      </Animate>
    </Body>
    <Animate start={0} end={1} delay={2800} on>
      {opacity => (
        <Modal.Button style={{ opacity }} onClick={onRestart}>
          Play Again
        </Modal.Button>
      )}
    </Animate>
  </Modal>
);

GameOver.propTypes = {
  blocksCleared: PropTypes.number.isRequired,
  boardsCleared: PropTypes.number.isRequired,
  lost: PropTypes.bool.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default GameOver;
