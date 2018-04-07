import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Chili from "./Chili";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChiliBlock = ({ className, style, blockWidth }) => (
  <Container className={className} style={style}>
    <Chili width={Math.round(blockWidth * 0.9)} />
  </Container>
);

ChiliBlock.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ChiliBlock;
