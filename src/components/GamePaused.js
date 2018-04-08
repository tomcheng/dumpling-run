import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const GamePaused = ({ paused, onResume }) => (
  <Modal open={paused}>
    <Modal.Title>Paused</Modal.Title>
    <Modal.Button onClick={onResume}>Resume</Modal.Button>
  </Modal>
);

GamePaused.propTypes = {
  paused: PropTypes.bool.isRequired,
  onResume: PropTypes.func.isRequired,
};

export default GamePaused;
