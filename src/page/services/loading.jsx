import React from 'react';
import ReactLoading from 'react-loading';
import './loading.scss';

export default function Loading({ type, color }) {
    return (
        <div className="divLoading">
            <ReactLoading type={type} color={color} height={'100px'} width={'100px'} className="loading" />
        </div>
    );
}
