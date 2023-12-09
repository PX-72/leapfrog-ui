import styled from 'styled-components';
import CurrencyPicker from './CurrencyPicker';
import { useStaticDataStore } from '@/stores/staticDataStore';

const StyledPanel = styled.div`
  background-color: ${(props) => `${props.theme.panel.backgroundColor}`};
  border-radius: ${(props) => `${props.theme.panel.borderRadius}}`};
  padding: ${(props) => `${props.theme.panel.padding}}`};
  margin: ${(props) => `${props.theme.panel.margin}}`};
  margin-left: 0px;
  padding-top: 0px;
  overflow: auto;
  grid-area: books;
`;


export const MainPanel = () => {
  const currencyPairs = useStaticDataStore(store => store.currencyPairs);

  return (
    <StyledPanel>
      <CurrencyPicker currencyPairs={currencyPairs} selectCurrencyPair={(c) => {}} />
    </StyledPanel>
  );
};
