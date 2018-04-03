import React from "react";
import PropTypes from "prop-types";
import Dumpling from "./Dumpling";
import DumplingActive from "./DumplingActive";

const Player = ({ isHolding }) =>
  isHolding ? <DumplingActive /> : <Dumpling />;

Player.propTypes = {
  isHolding: PropTypes.bool.isRequired
};

export default Player;
