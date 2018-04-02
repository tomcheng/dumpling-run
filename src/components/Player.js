import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/keys";
import { COLORS } from "../gameConstants";
import Block from "./Block";

const Player = ({ holding }) => (
  <div>
    {holding.map((color, index) => <Block key={index} color={color} />)}
    <div>Player</div>
  </div>
);

Player.propTypes = {
  holding: PropTypes.arrayOf(PropTypes.oneOf(keys(COLORS))).isRequired
};

export default Player;
