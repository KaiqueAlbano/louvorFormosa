import React, { useContext, useEffect } from 'react';
import './SubList.scss';
import './SubListMobile.scss';
import { useState } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import IconVisualizarPDF from '../../../components/icon/IconVisualizarPDF';
import IconAddPDF from '../../../components/icon/IconAddPDF';

export default function SubList(props) {
    const [open, setOpen] = useState(false);
    const [state, dispatch] = useContext(GlobalContext);
    // const [maxHeight, setMaxHeight] = useState('');

    // function getMaximumHeight() {
    //     console.log(window.innerHeight);
    //     return setMaxHeight(window.innerHeight);
    // }

    // useEffect(() => {
    //     getMaximumHeight();
    // }, []);

    const handleOnClick = () => {
        setOpen(!open);
        if (state.itemSelecionado?.idLouvor === props.list?.idLouvor && open) {
            dispatch({
                type: 'SET_ITEMSELECIONADO',
                payload: [],
            });
            return;
        }

        dispatch({
            type: 'SET_ITEMSELECIONADO',
            payload: props.list,
        });
    };

    if (props.listar === false) {
        return (
            <div className="SubList">
                <ul className="columns">
                    {props.columns.map((item, key) => (
                        <li key={key}>
                            {item.Descricao}{' '}
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={
                                    item.Descricao === 'ID'
                                        ? () => props.handleOrderByID()
                                        : () => props.handleOrderBy()
                                }
                                dangerouslySetInnerHTML={{ __html: item?.svg }}
                            />
                        </li>
                    ))}
                </ul>
                <div className="list">
                    {props.list.map((item, index) => (
                        <SubList
                            key={index}
                            list={item}
                            listar={true}
                            handleFileView={props.handleFileView}
                            handleButtonClick={props.handleButtonClick}
                            isDragging={props.isDragging}
                            setIsDragging={props.setIsDragging}
                        />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <ul className={open ? 'listLi Open' : 'listLi'}>
                <div className="linha" onClick={handleOnClick}>
                    <div>
                        <span
                            className={open ? 'Svg Open' : 'Svg'}
                            dangerouslySetInnerHTML={{ __html: props.listSvg }}
                        />
                        {props.list?.idLouvor}
                    </div>
                    <div className="descricao">{props.list?.Descricao}</div>
                    <div>{props.list?.Data}</div>
                </div>
                {open && (
                    <div className="subLinha">
                        <div>{`Tom: ${props.list?.Tom}`}</div>
                        <div>{`Tipo: ${props.list?.Tipo}`}</div>
                        <div className="subLinhaPDF">
                            <div
                                className="PDF"
                                onClick={() => {
                                    props.handleFileView(props);
                                }}
                            >
                                <IconVisualizarPDF />
                            </div>
                            <div
                                className="PDF"
                                onClick={() => {
                                    props.handleButtonClick(props);
                                }}
                            >
                                <IconAddPDF />
                            </div>
                        </div>
                    </div>
                )}
            </ul>
        );
    }
}

SubList.defaultProps = {
    columns: [
        {
            Descricao: 'ID',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="19" viewBox="0 0 12 19" fill="none"><g clip-path="url(#clip0_3_220)"><path d="M4.93781 16.9122C5.38703 17.3614 6.11656 17.3614 6.56578 16.9122L11.1658 12.3122C11.4964 11.9815 11.5934 11.4892 11.4138 11.058C11.2341 10.6267 10.8172 10.3464 10.35 10.3464H1.15C0.686408 10.3464 0.265939 10.6267 0.0862517 11.058C-0.0934358 11.4892 0.00718922 11.9815 0.33422 12.3122L4.93422 16.9122H4.93781ZM4.93781 1.4842L0.337814 6.0842C0.00718922 6.41483 -0.089842 6.90717 0.0898455 7.33842C0.269533 7.76967 0.686408 8.04998 1.1536 8.04998H10.35C10.8136 8.04998 11.2341 7.76967 11.4138 7.33842C11.5934 6.90717 11.4928 6.41483 11.1658 6.0842L6.56578 1.4842C6.11656 1.03498 5.38703 1.03498 4.93781 1.4842Z" fill="#8A8D8E"/></g><defs><clipPath id="clip0_3_220"><rect width="11.5" height="18.4" fill="white" transform="matrix(1 0 0 -1 0 18.4)"/></clipPath></defs></svg>',
        },
        { Descricao: 'Descrição' },
        {
            Descricao: 'Data',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="19" viewBox="0 0 12 19" fill="none"><g clip-path="url(#clip0_3_220)"><path d="M4.93781 16.9122C5.38703 17.3614 6.11656 17.3614 6.56578 16.9122L11.1658 12.3122C11.4964 11.9815 11.5934 11.4892 11.4138 11.058C11.2341 10.6267 10.8172 10.3464 10.35 10.3464H1.15C0.686408 10.3464 0.265939 10.6267 0.0862517 11.058C-0.0934358 11.4892 0.00718922 11.9815 0.33422 12.3122L4.93422 16.9122H4.93781ZM4.93781 1.4842L0.337814 6.0842C0.00718922 6.41483 -0.089842 6.90717 0.0898455 7.33842C0.269533 7.76967 0.686408 8.04998 1.1536 8.04998H10.35C10.8136 8.04998 11.2341 7.76967 11.4138 7.33842C11.5934 6.90717 11.4928 6.41483 11.1658 6.0842L6.56578 1.4842C6.11656 1.03498 5.38703 1.03498 4.93781 1.4842Z" fill="#8A8D8E"/></g><defs><clipPath id="clip0_3_220"><rect width="11.5" height="18.4" fill="white" transform="matrix(1 0 0 -1 0 18.4)"/></clipPath></defs></svg>',
        },
    ],
    list: [],
    listSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M1 12.9879L7.26311 7.26311L1.53831 0.999994"stroke="#606060" stroke-width="2" stroke-linecap="round"/></svg>',
    listar: false,
    handleFileView: () => null,
};
