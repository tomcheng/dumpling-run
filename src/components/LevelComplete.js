import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const LevelComplete = ({ levelComplete, onNewLevel }) => (
  <Modal open={levelComplete}>
    <Modal.Title>Level Complete</Modal.Title>
    <Modal.Button onClick={onNewLevel}>Next</Modal.Button>
  </Modal>
);

LevelComplete.propTypes = {
  levelComplete: PropTypes.bool.isRequired,
  onNewLevel: PropTypes.func.isRequired,
};

export default LevelComplete;
