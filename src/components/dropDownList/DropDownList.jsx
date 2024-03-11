import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import './DropDownList.scss';

export default function DropDownList(props) {
    const getDropdownList = () => {
        return (
            <div className={`DropDownList theme${props.theme}`}>
                <SelectBox
                    placeholder={props.placeholder}
                    dataSource={props.list}
                    displayExpr={props.displayExpr}
                    valueExpr={props.valueExpr}
                    onValueChanged={onChange}
                    noDataText="Não há dados para ser exibido"
                    {...(props.value !== null && {
                        value: props.value,
                    })}
                    {...(props.defaultValue !== null && {
                        defaultValue: props.defaultValue,
                    })}
                />
            </div>
        );
    };

    const onChange = (e) => {
        if (props.valueExpr === undefined) {
            props.onChange(e.value);
        } else {
            let found = props.list.find((f) => f[props.valueExpr] === e?.value);
            props.onChange(found);
        }
    };

    if (props.hasLabelContainer) {
        return (
            <div className="InputContainerDropdown">
                <span htmlFor={props.id}>{props.label}</span>

                <div className="button-group">{getDropdownList()}</div>
            </div>
        );
    }

    return getDropdownList();
}

DropDownList.defaultProps = {
    hasLabelContainer: true,
    list: [],
    onChange: () => null,
    id: '',
    label: '',
    placeholder: 'Selecione',
    displayExpr: undefined, //qual eh o campo que sera exibido
    valueExpr: undefined, //qual eh a chave unica da lista
    theme: '1',
    defaultValue: null,
    value: null,
};
