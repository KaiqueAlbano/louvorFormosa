import React, { useReducer, createContext } from 'react';
export const GlobalContext = createContext();

const initialState = {
    util: {},
    itemSelecionado: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_UTIL':
            return {
                ...state,
                util: action.payload,
            };
        case 'SET_ITEMSELECIONADO':
            return {
                ...state,
                itemSelecionado: action.payload,
            };
        default:
            throw new Error();
    }
};

export const GlobalContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <GlobalContext.Provider value={[state, dispatch]}>{props.children}</GlobalContext.Provider>;
};

export default GlobalContext;
