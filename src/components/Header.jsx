import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {
    signUserOut,
  } from 'blockstack';

export default class Header extends Component {

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
                <Button variant="outline-danger" onClick={ this.handleSignOut.bind(this) }>Sign Out</Button>
                </Navbar.Collapse>
            </Navbar>
        );
    }
  };