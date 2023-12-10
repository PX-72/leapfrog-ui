import styled from 'styled-components';

export const DefaultStyledSelect = styled.select`
    min-width: 200px;
    color: ${(props) => `${props.theme.button.color}`};
    background-color: ${(props) => `${props.theme.button.background}`};
    border-radius: 0.3rem;
    padding: 0.5rem;
`;
