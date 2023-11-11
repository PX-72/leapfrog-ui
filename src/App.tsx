import styled from 'styled-components';
import { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MainPanel } from './components/MainPanel';
import { useStore } from '@/store.js';
import { mediaSmallScreenPoint } from './components/common/styles';

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

    const ws = new WebSocket('ws://localhost:8090/market-data-ws');

    ws.onopen = function() {
      console.log('WebSocket Connection opened');
    };

    ws.onmessage = function(event) {
      console.log('Message received:', event.data);
    };

    ws.onclose = function() {
      console.log('WebSocket Connection closed');
    };

    ws.onerror = function(error) {
      console.log('WebSocket Error:', error);
    };

    const handleBeforeUnload = () => ws.close();

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log('CLOSING...');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      ws.close();
    }
  }, []);

  return (
    <StyledAppContainer>
      <ControlPanel />
      <MainPanel />
    </StyledAppContainer>
  );
};
