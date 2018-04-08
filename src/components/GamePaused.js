import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const GamePaused = ({ paused, onResume }) => (
  <Modal open={paused}>
    <div>GAME PAUSED</div>
    <button onClick={onResume}>Resume</button>
  </Modal>
);

GamePaused.propTypes = {
  paused: PropTypes.bool.isRequired,
  onResume: PropTypes.func.isRequired,
};

export default GamePaused;
