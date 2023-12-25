import DropDownList from '@/components/common/DropDownList';
import { DefaultButton } from '@/components/common/buttonStyles';
import { useEffect, useState } from 'react';
import { useMarketDataStore } from '@/stores/marketDataStore';

type CurrencyPickerProps = {
    currencyPairs: string[],
    defaultCurrencyPair: string
};

const CurrencyPicker = ({ currencyPairs, defaultCurrencyPair }: CurrencyPickerProps) => {
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState<string>('');

    const addSubscription = useMarketDataStore(store => store.addSubscriptions);

    useEffect(() => {
        setSelectedCurrencyPair(defaultCurrencyPair);
    }, [defaultCurrencyPair]);

    return (
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <DropDownList options={currencyPairs}
                          onSelect={(c) => setSelectedCurrencyPair(c)}
                          defaultItem={defaultCurrencyPair}/>
            <DefaultButton onClick={() => {
                addSubscription(selectedCurrencyPair);
            }}>Subscribe</DefaultButton>
        </div>
    );
};

export default CurrencyPicker;
