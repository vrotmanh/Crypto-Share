import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { redirectToSignIn } from 'blockstack';

export default class Signin extends Component {

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin;
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
  }

  render() {
    return (
      <div>
        <h1 className='title'>Crypto Share</h1>
        <Button className='m-4' variant="outline-primary" onClick={ this.handleSignIn.bind(this) }>Sign In with Blockstack</Button>
      </div>
    );
  }
}
