import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Transition from "react-transition-group/Transition";
import { COLORS } from "../gameConstants";

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: ${COLORS.background};
  transition: opacity 400ms ease-in-out 800ms;
  z-index: -1;
`;

const Modal = ({ children, open }) => (
  <Transition in={open} timeout={0}>
    {state =>
      ["entering", "entered"].includes(state) && (
        <Container>
          <Overlay style={{ opacity: state === "entered" ? 0.9 : 0 }} />
          {children(state)}
        </Container>
      )
    }
  </Transition>
);

Modal.propTypes = {
  children: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default Modal;