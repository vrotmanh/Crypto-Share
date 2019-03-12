import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
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
        <h1 className="mt-4 mb-4">Crypto Share</h1>
        <Button className='m-4' variant="outline-primary" onClick={ this.handleSignIn.bind(this) }>Sign In with Blockstack</Button>
      </Container>
    );
  }
}
