import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Rotas from './Route';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
