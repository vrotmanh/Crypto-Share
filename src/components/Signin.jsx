import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { redirectToSignIn } from 'blockstack';

export default class Signin extends Component {

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin;
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <h1 className="mt-4 mb-4">Crypto Share</h1>
          <p>
            Crypto Share is a decentralize app to share encrypted files using Blockstack.
          </p>
          <p>
            <Button variant="primary" onClick={ this.handleSignIn.bind(this) }>Sign In with Blockstack</Button>
          </p>
        </Jumbotron>
      </Container>
    );
  }
}
