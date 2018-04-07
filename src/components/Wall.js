import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BLOCK_BORDER_WIDTH, COLORS } from "../gameConstants";

const borderStyle = `${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown}`;

const Container = styled.div`
  border: ${borderStyle};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.background};
`;

const Row = styled.div`
  flex-grow: 1;
  display: flex;

  & + & {
    border-top: ${borderStyle};
  }
`;

const Brick = styled.div`
  background-color: rgba(0, 0, 0, 0.1);

  & + & {
    border-left: ${borderStyle};
  }
`;

const Wall = ({ className, style }) => (
  <Container className={className} style={style}>
    <Row>
      <Brick style={{ flexGrow: 1 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 1 }} />
    </Row>
    <Row>
      <Brick style={{ flexGrow: 1 }} />
      <Brick style={{ flexGrow: 1 }} />
      <Brick style={{ flexGrow: 1 }} />
      <Brick style={{ flexGrow: 1 }} />
    </Row>
    <Row>
      <Brick style={{ flexGrow: 1 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 2 }} />
      <Brick style={{ flexGrow: 1 }} />
    </Row>
  </Container>
);

Wall.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export default Wall;
