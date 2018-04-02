import { Component } from "react";
import PropTypes from "prop-types";

class Timer extends Component {
  static propTypes = {
    interval: PropTypes.number.isRequired,
    onAddNewRow: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.onAddNewRow();
    }, this.props.interval);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  render() {
    return null;
  }
}

export default Timer;
