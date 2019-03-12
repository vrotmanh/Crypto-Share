import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {
  isSignInPending,
  isUserSignedIn,
  handlePendingSignIn,
} from 'blockstack';

// Components
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Home from './Home.jsx'
import Signin from './Signin.jsx'
import ShareFile from './ShareFile.jsx'
import CheckFiles from './CheckFiles.jsx'

const history = createHistory({
  basename: '',
});

export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  render() {
    return (
      <div>
        <div className="App Site">
          <div className="Site-content">
          { !isUserSignedIn() ?
            <Signin/>
            : 
            <div>
              <Header/>
              <Router history={history}>
                <main>
                  <Switch>
                    <Route
                      exact
                      path="/files"
                      component={CheckFiles}
                    />
                    <Route
                      exact
                      path="/share"
                      component={ShareFile}
                    />
                    <Route
                      exact
                      path="*"
                      component={Home}
                    />
                  </Switch>
                </main>
              </Router>
            </div> }
          </div>
          <Footer/>
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
