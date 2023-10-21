import styled from 'styled-components';
import { useStore } from '@/store.js';

const StyledPanel = styled.div`
  background-color: ${(props) => `${props.theme.panel.backgroundColor}`};
  border-radius: ${(props) => `${props.theme.panel.borderRadius}}`};
  padding: ${(props) => `${props.theme.panel.padding}}`};
  margin: ${(props) => `${props.theme.panel.margin}}`};
  margin-left: 0px;
  padding-top: 0px;
  overflow: auto;
  grid-area: books;
`;

const StyledBookList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const MainPanel = () => {
  const books = useStore((state) => state);
  
  return (
    <StyledPanel>

    </StyledPanel>
  );
};
