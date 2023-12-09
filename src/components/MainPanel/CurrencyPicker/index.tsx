
type CurrencyPickerProps = {
    currencyPairs: string[],
    selectCurrencyPair: (selectedCurrencyPair: string) => void
}

const CurrencyPicker = ({ currencyPairs, selectCurrencyPair }: CurrencyPickerProps) => {
    const options = currencyPairs.map(pair => {
        return <option key={pair}>{pair}</option>
    });

    return (
        <input type="select" onChange={(e) => selectCurrencyPair(e.target.value)}>
            {options}
        </input>
    )
};

export default CurrencyPicker;
