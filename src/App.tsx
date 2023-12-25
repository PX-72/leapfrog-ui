import styled from 'styled-components';
import { ControlPanel } from './components/ControlPanel';
import { MainPanel } from './components/MainPanel';
import { mediaSmallScreenPoint } from './components/common/buttonStyles';
import { useEffect } from 'react';
import { useStaticDataStore } from '@/stores/staticDataStore';
import { marketDataConnection } from '@/api/shared-worker/market-data/workerClient';

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
    const loadCurrencyPairs = useStaticDataStore((state) => state.loadCurrencyPairs);

    useEffect(() => {
        loadCurrencyPairs();
        marketDataConnection.connect();

        window.onbeforeunload = () => {
            marketDataConnection.close();
        }

        return () => marketDataConnection.close();
    }, []);

    return (
        <StyledAppContainer>
            <ControlPanel />
            <MainPanel />
        </StyledAppContainer>
    );
};
