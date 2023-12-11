import styled from 'styled-components';
import CurrencyPicker from './CurrencyPicker';
import { useStaticDataStore } from '@/stores/staticDataStore';
import { useMarketDataStore } from '@/stores/marketDataStore';
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
`;

export const MainPanel = () => {
    const currencyPairs = useStaticDataStore(store => store.currencyPairs);
    const defaultCurrencyPair = useStaticDataStore(store => store.defaultCurrencyPair);
    const subscriptions = useMarketDataStore(store => store.subscriptions);

    return (
        <StyledPanel>
            <CurrencyPicker currencyPairs={currencyPairs} defaultCurrencyPair={defaultCurrencyPair} />
            <StyledRfqTicketContainer>
                {Object.keys(subscriptions).map(s => (
                    <RfqTicket currencyPair={s} key={s}/>
                ))}
            </StyledRfqTicketContainer>
        </StyledPanel>
    );
};
