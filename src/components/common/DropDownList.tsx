import { DefaultStyledSelect } from './dropdownStyles';
import { ChangeEvent } from 'react';

type DropDownListProps = {
    options: Map<string, string> | Array<string>,
    onSelect: (selected: string) => void,
    defaultItem: string,
    textWhenNoneSelected?: string
};

const arrayToMap = (array: Array<string>) => new Map(array.map(element => [element, element]));

const DropDownList = ({ options, onSelect, defaultItem, textWhenNoneSelected }: DropDownListProps) => {

    const optionsInternal = Array.from(Array.isArray(options) ? arrayToMap(options) : options);

    const optionElements = optionsInternal.map(([key, value]) => {
        return <option key={key}  value={key}>{value}</option>;
    });

    const onSelectInternal = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
        if (value.length > 0) onSelect(value);
    };

    return (
        <DefaultStyledSelect value={defaultItem} onChange={onSelectInternal}>
            {textWhenNoneSelected != null && <option value=''>{textWhenNoneSelected}</option>}
            {optionElements}
        </DefaultStyledSelect>
    )
};

export default DropDownList;
