import styled from 'styled-components';
import CurrencyPicker from './CurrencyPicker';
import { useStaticDataStore } from '@/stores/staticDataStore';
import { useMarketDataStore } from '@/stores/marketDataStore';
import { useShallow } from 'zustand/react/shallow';
import RfqTicket from '@/components/MainPanel/RfqTicket';

const StyledPanel = styled.div`
    background-color: ${(props) => `${props.theme.panel.backgroundColor}`};
    border-radius: ${(props) => `${props.theme.panel.borderRadius}}`};
    padding: ${(props) => `${props.theme.panel.padding}}`};
    margin: ${(props) => `${props.theme.panel.margin}}`};
    margin-left: 0;
    overflow: auto;
    grid-area: books;
`;

export const StyledRfqTicketContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.5rem;
`;

export const MainPanel = () => {
    const currencyPairs = useStaticDataStore(store => store.currencyPairs);
    const defaultCurrencyPair = useStaticDataStore(store => store.defaultCurrencyPair);
    const subscribedCcyPairs = useMarketDataStore(useShallow(store => Object.keys(store.subscriptions)));

    return (
        <StyledPanel>
            <CurrencyPicker currencyPairs={currencyPairs} defaultCurrencyPair={defaultCurrencyPair} />
            <StyledRfqTicketContainer>
                {subscribedCcyPairs.map(s => (
                    <RfqTicket currencyPair={s} key={s}/>
                ))}
            </StyledRfqTicketContainer>
        </StyledPanel>
    );
};
