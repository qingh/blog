import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from './pages/common/layout';
import Login from './pages/login';
import NotFound from '@pages/404';
import * as store from './store';
export default () => {
  render(
    <Provider {...store}>
      <Router>
        <Switch>
          <Route
            path="/"
            exact={true}
            render={() => {
              let token = localStorage.getItem('token');
              return token ? <Redirect to="/login" /> : <Redirect to="/home" />;
            }}
          />
          <Route path="/login" component={Login} />
          <Route path="/home" component={Layout} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </Provider>,
    document.getElementById('root')
  );
};
