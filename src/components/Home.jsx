import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default class Home extends Component {

  render() {
    return (
      <Container>
          <Jumbotron>
            <h1 className="mt-4 mb-4">Home</h1>
            <p>
              Crypto Share is a decentralize app to share encrypted files using Blockstack.
            </p>
            <p>
              <Button variant="primary" className="mr-2" href="/share">Share a File</Button>
              <Button variant="primary" href="/files">Check your Files</Button>
            </p>
        </Jumbotron>
      </Container>
    );
  }
}