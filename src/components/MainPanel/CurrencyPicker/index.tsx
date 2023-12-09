import DropDownList from '@/components/common/DropDownList';
import { sendRequest } from '@/api/marketDataApi';
import { DefaultButton } from '@/components/common/buttonStyles';


type CurrencyPickerProps = {
    currencyPairs: string[],
    selectCurrencyPair: (selectedCurrencyPair: string) => void
}

const CurrencyPicker = ({ currencyPairs, selectCurrencyPair }: CurrencyPickerProps) => {
    return (

        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <span>Subscribe to</span>
            <DropDownList options={currencyPairs} onSelect={selectCurrencyPair} />
            <DefaultButton onClick={() => {}}>Subscribe</DefaultButton>
        </div>

    )
};

export default CurrencyPicker;
