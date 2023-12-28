import styled from 'styled-components';
import { SmallButtonNoBg } from '@/components/common/buttonStyles';
import { useMarketDataStore } from '@/stores/marketDataStore';
import PriceView from '@/components/MainPanel/RfqTicket/PriceView';

export const StyledRfqTicket = styled.div`
    width: 400px;
    height: 160px;
    border-radius: 0.5rem;
    padding: 3px 8px;
    background-color: ${(props) => `${props.theme.panel.darkerBackgroundColor}`};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

type RfqTicketProps = {
    currencyPair: string
};

const getMargin = (bid: number, offer: number, scale: number): string => (offer - bid).toFixed(scale);

const RfqTicket = ({ currencyPair }: RfqTicketProps) => {
    const { data: {
            bid = 0,
            offer = 0,
            low = 0,
            high = 0,
            scale = 2,
            ecn = ''
        } = {}} = useMarketDataStore(state => state.subscriptions[currencyPair]);

    const removeSubscriptions = useMarketDataStore(state => state.removeSubscriptions);

    return <StyledRfqTicket>
        <div className="text-2xl">{currencyPair}</div>
        <div className="flex flex-row gap-2 p-0">
            <PriceView side='bid' price={bid} scale={scale}/>
            <PriceView side='ask' price={offer} scale={scale}/>
        </div>
        <div className="text-sm">ecn: {ecn}</div>
        <div className="absolute top-[44%] left-[42.2%] w-16 h-16 rounded-full bg-[#1b1b1d]">
            <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{getMargin(bid, offer, scale)}</div>
        </div>
        <SmallButtonNoBg onClick={() => removeSubscriptions(currencyPair)}
                     className="absolute top-2 right-2 w-4 h-4">
            <div className="text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">&#x2715;</div>
        </SmallButtonNoBg>
    </StyledRfqTicket>
};

export default RfqTicket;