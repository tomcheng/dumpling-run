import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { COLORS, GUTTER, TIMER_HEIGHT } from "../gameConstants";

const Container = styled.div`
  position: relative;
  margin-bottom: ${GUTTER}px;
`;

const TimerBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: ${COLORS.brown};
  opacity: 0.25;
`;

const TimerBar = styled.div`
  background-color: ${COLORS.brown};
  height: ${TIMER_HEIGHT}px;
  transform-origin: 0% 0%;
`;

class Timer extends Component {
  static propTypes = {
    interval: PropTypes.number.isRequired,
    paused: PropTypes.bool.isRequired,
    onAddNewRow: PropTypes.func.isRequired
  };

  state = {
    startTime: null,
    progress: null,
    request: null
  };

  componentDidMount() {
    this.resetTimer();
  }

  componentDidUpdate(prevProps) {
    const { paused, interval } = this.props;
    const { progress } = this.state;

    if (!prevProps.paused && paused) {
      cancelAnimationFrame(this.state.request);
    }

    if (prevProps.paused && !paused) {
      this.setState({
        startTime: Math.round(Date.now() - progress * interval),
        request: requestAnimationFrame(this.incrementTimer)
      });
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.request);
  }

  resetTimer = () => {
    this.setState({
      startTime: Date.now(),
      request: requestAnimationFrame(this.incrementTimer)
    });
  };

  incrementTimer = () => {
    const { interval, onAddNewRow } = this.props;
    const { startTime } = this.state;
    const newProgress = (Date.now() - startTime) / interval;

    if (newProgress >= 1) {
      onAddNewRow();
      this.resetTimer();
    } else {
      this.setState({
        progress: newProgress,
        request: requestAnimationFrame(this.incrementTimer)
      });
    }
  };

  render() {
    const { progress } = this.state;

    return (
      <Container>
        <TimerBackground />
        <TimerBar style={{ transform: `scale3d(${progress}, 1, 1)` }} />
      </Container>
    );
  }
}

export default Timer;
