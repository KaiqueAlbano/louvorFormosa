import React, { useEffect } from 'react';
import './InputDate.scss';
import 'devextreme/dist/css/dx.light.compact.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

export default function InputDate(props) {
    const handleChange = (e) => {
        console.log(e);
        return props.changeId ? props.onChange({ value: e?.value, id: props.id }) : props.onChange(e);
    };

    const getInputDate = () => {
        return (
            <DatePicker
                className={`louvorInputDate ${props.className} theme${props.theme}`}
                placeholderText="Data"
                dateFormat="dd/MM/yyyy"
                onChange={handleChange}
                value={props.value}
            />
        );
    };

    if (props.hasContainer) {
        return <div className="Container">{getInputDate()}</div>;
    }

    return getInputDate();
}

InputDate.defaultProps = {
    acceptCustomValue: false,
    className: '',
    hasContainer: true,
    id: Math.random().toString(),
    invalidDateMessage: 'Data invalida',
    isValid: true,
    max: undefined, //data maxima
    min: undefined, //data minima
    maxLength: 10,
    name: '',
    placeholder: '',
    onChange: () => null,
    value: null,
    theme: '1',
    changeId: false,
};
