import { Component } from "react";
import PropTypes from "prop-types";
import keys from "lodash/keys";

const easingFunctions = {
  linear: x => x,
  "ease-in": x => x * x * x,
  "ease-out": x => --x * x * x + 1,
  "ease-in-out": x =>
    x < 0.5 ? 4 * x * x * x : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1
};

class Animate extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    end: PropTypes.number.isRequired,
    on: PropTypes.bool.isRequired,
    start: PropTypes.number.isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
    easing: PropTypes.oneOf(keys(easingFunctions)),
    reverseDelay: PropTypes.number,
    reverseDuration: PropTypes.number,
    reverseEasing: PropTypes.oneOf(keys(easingFunctions)),
    onAnimationEnd: PropTypes.func
  };

  static defaultProps = {
    delay: 0,
    duration: 400,
    easing: "ease-in-out"
  };

  constructor(props) {
    super();
    this.state = { value: props.start };
  }

  componentDidMount() {
    if (this.props.on) {
      this.startAnimation();
    }
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

  getEasing = (props = this.props) =>
    easingFunctions[
      props.on ? props.easing : props.reverseEasing || props.easing
    ];

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
    const easing = this.getEasing();
    const targetValue = this.getTargetValue();
    const now = Date.now();

    if (now < startTime + delay) {
      this.setState({ request: requestAnimationFrame(this.updateAnimation) });
      return;
    }

    if (now < startTime + delay + duration) {
      this.setState({
        value:
          easing((now - startTime - delay) / duration) *
            (targetValue - startValue) +
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
