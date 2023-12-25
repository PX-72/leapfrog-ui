import styled from 'styled-components';

const StyledControlPanel = styled.div`
    background-color: ${(props) => `${props.theme.panel.backgroundColor}`};
    border-radius: ${(props) => `${props.theme.panel.borderRadius}}`};
    padding: ${(props) => `${props.theme.panel.padding}}`};
    margin: ${(props) => `${props.theme.panel.margin}}`};
    grid-area: control;
`;

const ControlPanelItemBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    row-gap: 1rem;
    
    .top-ctr-wrapper {
        display: flex;
        flex-direction: column;
    }
`;

export const ControlPanel = () => {
    return (
        <StyledControlPanel>
            <ControlPanelItemBox>
                <h3>Market Data View</h3>
            </ControlPanelItemBox>
        </StyledControlPanel>
    );
};
