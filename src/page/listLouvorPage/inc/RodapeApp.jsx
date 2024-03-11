import React from 'react';
import './RodapeApp.scss';
import IconLimpar from '../../../components/icon/IconLimpar';
import IconAdd from '../../../components/icon/IconAdd';
import IconSalvar from '../../../components/icon/IconSalvar';
import IconEditar from '../../../components/icon/IconEditar';
import IconExcluir from '../../../components/icon/IconExcluir';

export default function RodapeApp(props) {
    return (
        <div className="RodapeApp">
            <div className="iconBackgroud" title="Limpar" onClick={() => props.onClickLimpar()}>
                <IconLimpar />
            </div>
            <div className="iconBackgroud" title="Adicionar" onClick={() => props.onClickAdd()}>
                <IconAdd />
            </div>
            <div className="iconBackgroud" title="Salvar" onClick={() => props.onClickSalvar()}>
                <IconSalvar />
            </div>
            <div className="iconBackgroud" title="Editar" onClick={() => props.onClickEditar()}>
                <IconEditar />
            </div>
            <div className="iconBackgroud" title="Excluir" onClick={props.onClickExcluir}>
                <IconExcluir />
            </div>
        </div>
    );
}

RodapeApp.defaultProps = {
    onClickLimpar: () => null,
    onClickAdd: () => null,
    onClickSalvar: () => null,
    onClickEditar: () => null,
    onClickExcluir: () => null,
};
