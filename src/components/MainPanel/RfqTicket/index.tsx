import styled from 'styled-components';
import { useMarketDataStore } from '@/stores/marketDataStore';

export const StyledRfqTicket = styled.div`
    width: 400px;
    height: 160px;
    border-radius: 0.5rem;
    border: solid 1px gray;
`;

type RfqTicketProps = {
    currencyPair: string
}

const RfqTicket = ({ currencyPair }: RfqTicketProps) => {
    const marketDataSubscription = useMarketDataStore(state => state.subscriptions[currencyPair]);
    return <StyledRfqTicket>{currencyPair} / {marketDataSubscription?.data?.bid}</StyledRfqTicket>
};

export default RfqTicket;