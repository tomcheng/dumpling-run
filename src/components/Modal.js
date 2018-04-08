import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Animate from "./Animate";
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
  z-index: -1;
`;

const Modal = ({ children, open, delay }) => (
  <Animate start={0} end={0.9} delay={delay} on={open}>
    {value => (
      <Container style={{ visibility: open ? "visible" : "hidden" }}>
        <Overlay style={{ opacity: value }} />
        {children}
      </Container>
    )}
  </Animate>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired
};

Modal.defaultProps = {
  delay: 0
};

export default Modal;
