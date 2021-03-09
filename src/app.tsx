import * as React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './MainPage';

const reactContainer = document.getElementById('app');

const jsx = (
    <MainPage />
)

ReactDOM.render(jsx, reactContainer);