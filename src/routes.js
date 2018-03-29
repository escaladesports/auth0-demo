import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CallBack from './CallBack';
import App from './App';
import Auth from './Auth';

const auth = new Auth();

const handleAuth = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuth();
  }
};

const routes = (
  <Switch>
    <Route
      path="/callback"
      render={props => {
        handleAuth(props);
        return <CallBack {...props} />;
      }}
    />
    <Route path="/" render={props => <App auth={auth} {...props} />} />
  </Switch>
);

export default routes;
