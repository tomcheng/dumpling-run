import { Component } from "react";
import PropTypes from "prop-types";

const NEW_ROW_INTERVAL = 15000;

class Timer extends Component {
  static propTypes = {
    onAddNewRow: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.onAddNewRow();
    }, NEW_ROW_INTERVAL)
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
