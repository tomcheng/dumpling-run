import styled from "styled-components";

const Block = styled.div`
  height: 30px;
  & + & {
    margin-top: 2px;
  }
`;

export default Block;

