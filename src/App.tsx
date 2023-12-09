import styled from 'styled-components';
import { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MainPanel } from './components/MainPanel';
import { useStore } from '@/store.js';
import { mediaSmallScreenPoint } from './components/common/styles';
import { getCurrencyPairs } from '@/api/staticDataApi';

const StyledAppContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: fit-content(300px) 1fr;
  grid-template-areas:
    'control books';

  @media only screen and (${mediaSmallScreenPoint}) {
    grid-template-columns: 1fr;
    grid-template-rows: 0.6fr 1fr;
    grid-template-areas:
      'control'
      'books';
  }
`;

export const App = () => {
  const store = useStore();

  useEffect(() => {
      const ccyPairs = getCurrencyPairs();
  }, []);

  return (
    <StyledAppContainer>
      <ControlPanel />
      <MainPanel />
    </StyledAppContainer>
  );
};
