import { Component } from "react";
import PropTypes from "prop-types";

class Animate extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    end: PropTypes.number.isRequired,
    on: PropTypes.bool.isRequired,
    start: PropTypes.number.isRequired,
    duration: PropTypes.number,
    delay: PropTypes.number
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

  startAnimation = () => {
    this.setState({
      startTime: Date.now(),
      startValue: this.state.value,
      request: requestAnimationFrame(this.updateAnimation)
    });
  };

  updateAnimation = () => {
    const { duration } = this.props;
    const { startTime, startValue } = this.state;
    const targetValue = this.getTargetValue();
    const now = Date.now();

    if (now >= startTime + duration) {
      this.setState({
        value: targetValue,
        request: null
      });
      return;
    }

    const newValue =
      (now - startTime) / duration * (targetValue - startValue) + startValue;
    this.setState({
      value: newValue,
      request: requestAnimationFrame(this.updateAnimation)
    });
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;

    return children(value);
  }
}

export default Animate;
