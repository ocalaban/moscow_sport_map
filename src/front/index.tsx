import * as React from 'react';
import ReactDOM from 'react-dom';

const DG = require('2gis-maps');

import './css/index.scss';
import App from './App';

DG.then
(
    function()
    {
        return DG.plugin('https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js');
    }
).then(
    function() {
        ReactDOM.render(
            <App />,
            document.getElementById('root')
        );        
    }
)

