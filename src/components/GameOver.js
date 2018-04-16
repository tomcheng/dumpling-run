import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Animate from "./Animate";

const GameOver = ({ lost, level, score, onRestart }) => (
  <Modal open={lost} delay={800}>
    <Animate delay={400}>
      {opacity => <Modal.Title style={{ opacity }}>Game Over</Modal.Title>}
    </Animate>
    <Modal.Body>
      <Animate delay={1200}>
        {opacity => <div style={{ opacity }}>Level Reached: {level}</div>}
      </Animate>
      <Animate delay={2000}>
        {opacity => <div style={{ opacity }}>Final Score: {score}</div>}
      </Animate>
    </Modal.Body>
    <Animate delay={2800}>
      {opacity => (
        <Modal.Button
          style={{ opacity }}
          onClick={onRestart}
          disabled={opacity < 1}
        >
          Play Again
        </Modal.Button>
      )}
    </Animate>
  </Modal>
);

GameOver.propTypes = {
  level: PropTypes.number.isRequired,
  lost: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default GameOver;
