import styled from 'styled-components';


export const StyledRfqTicketContainer = styled.div`
    width: 140px;
    height: 70px;
    border-radius: 0.5rem;
    border: solid 1px gray;
`;

type RfqTicketContainerProps = {
    currencyPair: string
}

export const RfqTicketContainer = ({ currencyPair }: RfqTicketContainerProps) => {

    return <StyledRfqTicketContainer>{currencyPair}</StyledRfqTicketContainer>
};