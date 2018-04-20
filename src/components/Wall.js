import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import range from "lodash/range";
import shuffle from "lodash/shuffle";
import {
  BLOCK_BORDER_WIDTH,
  COLORS,
  BLOCK_DISAPPEAR_DURATION
} from "../gameConstants";

const borderStyle = `${BLOCK_BORDER_WIDTH}px solid ${COLORS.brown}`;

const Container = styled.div`
  border: ${borderStyle};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.brown};
`;

const Row = styled.div`
  flex-grow: 1;
  display: flex;

  & + & {
    border-top: ${borderStyle};
  }
`;

const Brick = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  background-color: #fff;
  opacity: ${props => (props.damaged ? 0 : 1)};
  transition: opacity 1ms linear ${BLOCK_DISAPPEAR_DURATION}ms;

  &:not(:first-child) {
    border-left: ${borderStyle};
  }
`;

const QuarterBrick = styled(Brick)`
  flex-basis: 25%;
`;

const EightBrick = styled(Brick)`
  flex-basis: 12.5%;
`;

class Wall extends Component {
  static propTypes = {
    wallDamage: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.wallDamage === prevState.wallDamage) {
      return null;
    }

    if (nextProps.wallDamage === 0) {
      return { wallDamage: 0, damagedBricks: {} };
    }

    if (nextProps.wallDamage && !prevState.damagedBricks) {
      return {
        wallDamage: nextProps.wallDamage,
        damagedBricks: shuffle(range(14))
          .slice(0, nextProps.wallDamage === 1 ? 4 : 10)
          .reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
      };
    }

    const bricksToDamage = shuffle(
      range(14).filter(i => !prevState.damagedBricks[i])
    ).slice(0, nextProps.wallDamage === 1 ? 4 : 6);

    return {
      wallDamage: nextProps.wallDamage,
      damagedBricks: bricksToDamage.reduce(
        (acc, curr) => ({ ...acc, [curr]: true }),
        prevState.damagedBricks
      )
    };
  }

  render() {
    const { className, style } = this.props;
    const { damagedBricks } = this.state;

    return (
      <Container className={className} style={style}>
        <Row>
          <EightBrick damaged={damagedBricks[0]} />
          <QuarterBrick damaged={damagedBricks[1]} />
          <QuarterBrick damaged={damagedBricks[2]} />
          <QuarterBrick damaged={damagedBricks[3]} />
          <EightBrick damaged={damagedBricks[4]} />
        </Row>
        <Row>
          <QuarterBrick style={{ flexGrow: 1 }} damaged={damagedBricks[5]} />
          <QuarterBrick style={{ flexGrow: 1 }} damaged={damagedBricks[6]} />
          <QuarterBrick style={{ flexGrow: 1 }} damaged={damagedBricks[7]} />
          <QuarterBrick style={{ flexGrow: 1 }} damaged={damagedBricks[8]} />
        </Row>
        <Row>
          <EightBrick damaged={damagedBricks[9]} />
          <QuarterBrick damaged={damagedBricks[10]} />
          <QuarterBrick damaged={damagedBricks[11]} />
          <QuarterBrick damaged={damagedBricks[12]} />
          <EightBrick damaged={damagedBricks[13]} />
        </Row>
      </Container>
    );
  }
}

export default Wall;
