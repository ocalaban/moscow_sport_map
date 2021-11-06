import * as React from 'react';
import ReactDOM from 'react-dom';
const DG = require('2gis-maps');
import 'antd/dist/antd.css';

import './App.scss';

import App from './App';
import { LoginPage } from './LoginPage/LoginPage';
import { BrowserRouter } from 'react-router-dom';

DG.then
(
    function()
    {
        return DG.plugin('https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js');
    }
).then(
    function() {
        ReactDOM.render(
            <BrowserRouter>
                <App />
            </BrowserRouter>,
            document.getElementById('root')
        );        
    }
)

