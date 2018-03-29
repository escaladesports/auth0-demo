import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Router } from 'react-router-dom';
import routes from './routes';
import history from './history';

ReactDOM.render(
  <Router history={history}>{routes}</Router>,
  document.getElementById('root')
);
registerServiceWorker();
