import React from "react";
import PropTypes from "prop-types";
import {
  POINTS_FOR_CLEARING_LEVEL,
  POINTS_FOR_CLEARING_BOARD
} from "../gameConstants";
import Modal from "./Modal";
import Animate from "./Animate";

const LevelComplete = ({ levelCleared, onNewLevel, boardCleared }) => (
  <Modal open={levelCleared}>
    <Animate delay={400}>
      {opacity => <Modal.Title style={{ opacity }}>Level Complete</Modal.Title>}
    </Animate>
    <Modal.Body>
      <Animate delay={1200}>
        {opacity => (
          <div style={{ opacity }}>
            Points for clearing level:{" "}
            <strong>{POINTS_FOR_CLEARING_LEVEL}</strong>
          </div>
        )}
      </Animate>
      {boardCleared && (
        <Animate delay={2000}>
          {opacity => (
            <div style={{ opacity }}>
              Points for clearing board:{" "}
              <strong>{POINTS_FOR_CLEARING_BOARD}</strong>
            </div>
          )}
        </Animate>
      )}
    </Modal.Body>
    <Animate delay={boardCleared ? 2800 : 2000}>
      {opacity => (
        <Modal.Button
          onClick={opacity > 0 ? onNewLevel : null}
          style={{ opacity }}
        >
          Next
        </Modal.Button>
      )}
    </Animate>
  </Modal>
);

LevelComplete.propTypes = {
  boardCleared: PropTypes.bool.isRequired,
  levelCleared: PropTypes.bool.isRequired,
  onNewLevel: PropTypes.func.isRequired
};

export default LevelComplete;
