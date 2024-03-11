import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';
import ListLouvorPage from './page/listLouvorPage/ListLouvorPage';

export default function Rotas() {
    return (
        <GlobalContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ListLouvorPage />} />
                    {/* <Route path="/louvorFormosa" element={<LouvorPage />} /> */}
                </Routes>
            </BrowserRouter>
        </GlobalContextProvider>
    );
}
