import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class FileItem extends Component {

    download(filename, content) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

    render() {
        return (
            <Card className='file'>
                <Card.Header>{this.props.title}</Card.Header>
                <Card.Body>
                    <Card.Title>{this.props.filename}</Card.Title>
                    <Button variant="primary" onClick={ this.download.bind(null, this.props.filename, this.props.content) }>Download</Button>
                </Card.Body>
            </Card>
        );
    }
}