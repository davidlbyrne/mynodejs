import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import SortTable from './SortTable';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<SortTable />, document.getElementById('root'));

registerServiceWorker();
