import React, { Component } from "react";
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

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired
  };

  static defaultProps = {
    delay: 0
  };

  state = {};
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.open !== prevState.open) {
      return { animationEnded: false, open: nextProps.open };
    }
    return null;
  }

  handleAnimationEnd = () => {
    this.setState({ animationEnded: true });
  };

  render() {
    const { children, delay } = this.props;
    const { animationEnded, open } = this.state;

    return (
      <Animate
        start={0}
        end={0.9}
        on={open}
        duration={200}
        delay={delay}
        reverseDuration={0}
        reverseDelay={0}
        onAnimationEnd={this.handleAnimationEnd}
      >
        {value => (
          <Container style={{ visibility: open ? "visible" : "hidden" }}>
            <Overlay style={{ opacity: value }} />
            {open && animationEnded && children}
          </Container>
        )}
      </Animate>
    );
  }
}

export default Modal;
