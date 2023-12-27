import styled from 'styled-components';
import { SmallButton } from '@/components/common/buttonStyles';
import { useMarketDataStore } from '@/stores/marketDataStore';

export const StyledRfqTicket = styled.div`
    width: 400px;
    height: 160px;
    border-radius: 0.5rem;
    border: solid 1px transparent;
    padding: 6px 12px;
    background-color: ${(props) => `${props.theme.panel.darkerBackgroundColor}`};
    position: relative;
`;

type RfqTicketProps = {
    currencyPair: string
}

const RfqTicket = ({ currencyPair }: RfqTicketProps) => {
    const marketDataUpdate = useMarketDataStore(state => state.subscriptions[currencyPair]);
    const removeSubscriptions = useMarketDataStore(state => state.removeSubscriptions);


    return <StyledRfqTicket>
        <div className="text-2xl">{currencyPair}</div>
        <div className="text-xs">bid: {marketDataUpdate.data?.bid}</div>
        <div className="text-xs">ask: {marketDataUpdate.data?.offer}</div>
        <div className="text-xs">ecn: {marketDataUpdate.data?.ecn}</div>
        <SmallButton onClick={() => removeSubscriptions(currencyPair)}
                     className="absolute top-1 right-1 w-4 h-4">x</SmallButton>
    </StyledRfqTicket>
};

export default RfqTicket;