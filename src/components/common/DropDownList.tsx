import { DefaultStyledSelect } from './dropdownStyles';
import { ChangeEvent, useState } from 'react';

type DropDownListProps = {
    options: Map<string, string> | Array<string>,
    onSelect: (selected: string) => void,
    defaultItem: string,
    textWhenNoneSelected?: string
};

const arrayToMap = (array: Array<string>) => new Map(array.map(element => [element, element]));

const DropDownList = ({ options, onSelect, defaultItem, textWhenNoneSelected }: DropDownListProps) => {
    const [selectedItem, setSelectedItem] = useState<string>(defaultItem);

    const optionsInternal = Array.from(Array.isArray(options) ? arrayToMap(options) : options);

    const optionElements = optionsInternal.map(([key, value]) => {
        return <option key={key}  value={key}>{value}</option>;
    });

    const onSelectInternal = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(value);
        if (value.length > 0) onSelect(value);
    };

    return (
        <DefaultStyledSelect value={selectedItem} onChange={onSelectInternal}>
            {textWhenNoneSelected != null && <option value=''>{textWhenNoneSelected}</option>}
            {optionElements}
        </DefaultStyledSelect>
    )
};

export default DropDownList;
