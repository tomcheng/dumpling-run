import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Chili from "./Chili";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChiliWrapper = styled.div`
  width: 90%;
`;

const ChiliBlock = ({ className, style }) => (
  <Container className={className} style={style}>
    <ChiliWrapper>
      <Chili />
    </ChiliWrapper>
  </Container>
);

ChiliBlock.propTypes = {
  blockWidth: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ChiliBlock;
