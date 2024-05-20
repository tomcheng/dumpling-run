import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import styled from "styled-components";
import Dumpling from "./Dumpling";
import { CHARACTER_WIDTH, COLORS } from "../gameConstants";
import DumplingActive from "./DumplingActive";

const GamePaused = ({
  blockWidth,
  character,
  paused,
  onChangeCharacter,
  onResume,
}) => (
  <Modal open={paused}>
    <Modal.Title>Paused</Modal.Title>
    <CharactersContainer>
      <SelectionBox
        selected={character === "dumpling"}
        onClick={() => {
          onChangeCharacter("dumpling");
        }}
      >
        <Dumpling width={80} character="dumpling" />
      </SelectionBox>
      <SelectionBox
        selected={character === "miseh"}
        onClick={() => {
          onChangeCharacter("miseh");
        }}
      >
        <Dumpling width={100} character="miseh" />
      </SelectionBox>
    </CharactersContainer>
    <Modal.Button onClick={onResume}>Resume</Modal.Button>
  </Modal>
);

GamePaused.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  character: PropTypes.string.isRequired,
  paused: PropTypes.bool.isRequired,
  onChangeCharacter: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
};

export default GamePaused;

const CharactersContainer = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  padding-bottom: 24px;
`;

const SelectionBox = styled.div`
  border: 2px solid
    ${({ selected }) => (selected ? COLORS.brown : "transparent")};
  border-radius: 6px;
  transition: border-color 0.2s;
  width: 100px;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;
