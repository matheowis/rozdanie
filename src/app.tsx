import * as React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './pages/MainPage';
import CanvasPage from './pages/CanvasPage';

const reactContainer = document.getElementById('app');

const jsx = (
    // <MainPage />
    <CanvasPage />
)

ReactDOM.render(jsx, reactContainer);