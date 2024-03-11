import React from 'react';
import './Input.scss';

export default function Input(props) {
    const onReturn = (value) => {
        return props.changeId ? props.onChange({ value: value, id: props.id }) : props.onChange(value);
    };

    const handleChange = (e) => {
        const input = e.target.value;

        if (props.type === 'number') {
            // Remove todos os caracteres que nao sao numeros
            const tmp = input?.replace(/[^0-9]/g, '');
            onReturn(tmp);
            return;
        }

        return onReturn(input);
    };

    const getInput = () => {
        let inputClassName = `LouvorInput ${props.className} theme${props.theme}`;

        return (
            <input
                id={props.id}
                className={inputClassName}
                type={
                    props.type === 'number' || props.type === 'document' || props.type === 'date' ? 'text' : props.type
                }
                placeholder={props.placeholder}
                name={props.name}
                value={props.value}
                onChange={handleChange}
                autoComplete={props.autoComplete}
                disabled={props.disabled}
                readOnly={props.readonly}
                style={props.style}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                {...(props.minLength && {
                    minLength: props.minLength,
                })}
                {...(props.maxLength && {
                    maxLength: props.maxLength,
                })}
                {...(props.onEnter !== null && {
                    onKeyUp: (e) => {
                        if (e.key == 'Enter') {
                            props.onEnter();
                        }
                    },
                })}
            />
        );
    };
    return getInput();
}

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    id: Math.random().toString(),
    changeId: false,
    className: '',
    name: '',
    maxLength: null,
    minLength: null,
    value: '',
    onChange: () => null,
    onEnter: () => null,
    onFocus: () => null,
    onBlur: () => null,
    autoComplete: 'new-password', //unica forma encontrada de desabilitar autocomplete do Chrome
    disabled: false,
    readonly: false,
    style: {},
    theme: '1',
};
