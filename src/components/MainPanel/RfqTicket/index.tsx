import styled from 'styled-components';


export const StyledRfqTicket = styled.div`
    width: 140px;
    height: 70px;
    border-radius: 0.5rem;
    border: solid 1px gray;
`;

type RfqTicketProps = {
    currencyPair: string
}

const RfqTicket = ({ currencyPair }: RfqTicketProps) => {

    return <StyledRfqTicket>{currencyPair}</StyledRfqTicket>
};

export default RfqTicket;