import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ethUtils from 'ethereumjs-util';
import {
    signUserOut,
    loadUserData,
    putFile,
  } from 'blockstack';
  

export default class Header extends Component {
    constructor (props) {
        super(props);
    
        this.state = {
          username: '',
        };
    }

    handleSignOut(e) {
        e.preventDefault();
        signUserOut(window.location.origin)
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">CryptoShare</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="share">Share File</Nav.Link>
                        <Nav.Link href="files">Check Files</Nav.Link>
                    </Nav>
                {this.state.username ? 
                <Navbar.Text className="mr-4">
                    Signed in as: <span className="bold">{this.state.username}</span>
                </Navbar.Text>
                : ''}
                <Button variant="outline-danger" onClick={ this.handleSignOut.bind(this) }>Sign Out</Button>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    componentWillMount() {
        // Get Username
        this.setState({ username: loadUserData().username });

        // Store Public key
        const privateKey = new Buffer(loadUserData().appPrivateKey, 'hex');
        const publicKey = '0x' + ethUtils.privateToPublic(privateKey).toString('hex');
        putFile('pubKey.json', JSON.stringify({ publicKey: publicKey }), { encrypt: false });
    }
  };