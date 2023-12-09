import { DefaultStyledSelect } from './dropdownStyles';
import { ChangeEvent } from 'react';

type DropDownListProps = {
    options: Map<string|number, string|number> | Array<string|number>,
    onSelect: (selected: string) => void,
    selected?: string|number,
    textWhenNoneSelected?: string
};

const arrayToMap = (array: Array<string|number>) => array.reduce((map, element) => {
    map.set(element, element);
    return map;
}, new Map());

const DropDownList = ({ options, onSelect, selected, textWhenNoneSelected }: DropDownListProps) => {

    const optionsInternal = Array.isArray(options) ? arrayToMap(options) : options;

    const optionElements = Array.from(optionsInternal).map(([key, value]) => {
        return <option key={key} value={key}>{value}</option>
    });

    const onSelectInternal = (e: ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val.length > 0)
            onSelect(val);
    };

    return (
        <DefaultStyledSelect value={selected} onChange={onSelectInternal}>
            {textWhenNoneSelected != null && <option value="">{textWhenNoneSelected}</option>}
            {optionElements}
        </DefaultStyledSelect>
    )
};

export default DropDownList;