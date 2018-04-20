import React, { Component } from "react";
import PropTypes from "prop-types";
import { getHighScore, updateHighScore } from "../utils/persistence";
import Modal from "./Modal";
import Animate from "./Animate";

const DELAY = 400;
const INTERVAL = 800;

class GameOver extends Component {
  static propTypes = {
    level: PropTypes.number.isRequired,
    lost: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired,
    onRestart: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { lost, level, score } = this.props;
    if (!prevProps.lost && lost) {
      updateHighScore({ level, score });
    }
  }

  render() {
    const { lost, level, score, onRestart } = this.props;
    const { level: highLevel, score: highScore } = getHighScore();

    return (
      <Modal open={lost} delay={800}>
        <Animate delay={DELAY}>
          {opacity => <Modal.Title style={{ opacity }}>Game Over</Modal.Title>}
        </Animate>
        <Modal.Body>
          <Animate delay={DELAY + INTERVAL}>
            {opacity => <div style={{ opacity }}>Final Score: {score}</div>}
          </Animate>
          <Animate delay={DELAY + 2 * INTERVAL}>
            {opacity => <div style={{ opacity }}>Highest Score: {Math.max(score, highScore)}</div>}
          </Animate>
          <Animate delay={DELAY + 3 * INTERVAL}>
            {opacity => <div style={{ opacity }}>Final Level: {level}</div>}
          </Animate>
          <Animate delay={DELAY + 4 * INTERVAL}>
            {opacity => <div style={{ opacity }}>Highest Level: {Math.max(level, highLevel)}</div>}
          </Animate>
        </Modal.Body>
        <Animate delay={DELAY + 5 * INTERVAL}>
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
  }
}

export default GameOver;
