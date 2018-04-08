import { Component } from "react";
import PropTypes from "prop-types";

class Animate extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    end: PropTypes.number.isRequired,
    on: PropTypes.bool.isRequired,
    start: PropTypes.number.isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
    reverseDelay: PropTypes.number,
    reverseDuration: PropTypes.number,
    onAnimationEnd: PropTypes.func
  };

  static defaultProps = {
    delay: 0,
    duration: 400
  };

  constructor(props) {
    super();
    this.state = { value: this.getTargetValue(props) };
  }

  componentDidUpdate(prevProps) {
    if (this.props.on !== prevProps.on) {
      this.startAnimation();
    }
  }

  getTargetValue = (props = this.props) => (props.on ? props.end : props.start);

  getDuration = (props = this.props) =>
    props.on
      ? props.duration
      : typeof props.reverseDuration === "number"
        ? props.reverseDuration
        : props.duration;

  getDelay = (props = this.props) =>
    props.on
      ? props.delay
      : typeof props.reverseDelay === "number"
        ? props.reverseDelay
        : props.delay;

  startAnimation = () => {
    this.setState({
      startTime: Date.now(),
      startValue: this.state.value,
      request: requestAnimationFrame(this.updateAnimation)
    });
  };

  updateAnimation = () => {
    const { startTime, startValue } = this.state;

    const duration = this.getDuration();
    const delay = this.getDelay();
    const targetValue = this.getTargetValue();
    const now = Date.now();

    if (now < startTime + delay) {
      this.setState({ request: requestAnimationFrame(this.updateAnimation) });
      return;
    }

    if (now < startTime + delay + duration) {
      this.setState({
        value:
          (now - startTime - delay) / duration * (targetValue - startValue) +
          startValue,
        request: requestAnimationFrame(this.updateAnimation)
      });
      return;
    }

    this.setState(
      {
        value: targetValue,
        request: null
      },
      () => {
        if (this.props.onAnimationEnd) {
          this.props.onAnimationEnd();
        }
      }
    );
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;

    return children(value);
  }
}

export default Animate;
