import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const LevelComplete = ({ levelCleared, onNewLevel }) => (
  <Modal open={levelCleared}>
    <Modal.Title>Level Complete</Modal.Title>
    <Modal.Button onClick={onNewLevel}>Next</Modal.Button>
  </Modal>
);

LevelComplete.propTypes = {
  levelCleared: PropTypes.bool.isRequired,
  onNewLevel: PropTypes.func.isRequired,
};

export default LevelComplete;
