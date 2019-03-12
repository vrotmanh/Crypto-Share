import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { encrypt } from './../utils/encryption';
import {
    getFile,
    putFile,
  } from 'blockstack';  

export default class ShareFile extends Component {

    constructor (props) {
        super(props);
    
        this.fileInput = React.createRef();
        this.state = {
          username: '',
          file: '',
          errorMessage: '',
          successMessage: '',
          loading: false,
          progress: 0,
        };
    }

    onInputChange(property) { 
        return (event) => {
            const value = event.target.value;
            this.setState({ [property]: value });
        }
    }
    
    shareFile(e) {
        e.preventDefault();
        this.setState({ errorMessage: '', successMessage: '' });
        const username = this.state.username;

        // Validate inputs
        if(!username){
            this.setState({ errorMessage: "Enter Receiver's Username", loading: false });
            return
        }
        if(!this.state.file){
            this.setState({ errorMessage: "Enter File to share", loading: false });
            return       
        }

        // Set progressBar
        this.setState({ loading: true, progress: 10 });

        // Get Public key of the User
        getFile('pubKey.json', { username: username, decrypt: false })
        .then((pubKeyFile) => {
            this.setState({ progress: 40 });
            const publicKey = JSON.parse(pubKeyFile).publicKey;
            const file = this.fileInput.current.files[0];
            const filename = file.name;

            // Read File
            const fileReader = new FileReader();
            fileReader.onloadend = async (e) => {
                this.setState({ progress: 50 });
                const content = fileReader.result;

                // Encrypt content
                let encrypted;
                try {
                    encrypted = await encrypt(publicKey, content);
                } catch (e) {
                    this.setState({ errorMessage: 'Error Encrypting', loading: false });
                    console.log('Error Encrypting: ' + e)
                }
                this.setState({ progress: 60 });

                // Save encrypted file in Blockstack
                let filesContent = {};
                try {
                    await getFile('files.json', { decrypt: false }).then(files => { 
                        this.setState({ progress: 70 });
                        if(files){filesContent = JSON.parse(files)};
                    });
                } finally {
                    // Generate new File
                    this.setState({ progress: 90 });
                    const newFile = { encrypted: encrypted, filename: filename };
                    if(filesContent && (username in filesContent)){
                        filesContent[username].push(newFile);
                    } else{
                        filesContent[username] = [newFile];
                    }

                    // Store new file in Blockstack
                    await putFile('files.json', JSON.stringify(filesContent), { encrypt: false });
                    this.setState({ successMessage: 'File sent!', loading: false });
                }
                
            }
            this.setState({ loading: true, progress: 30 });
            fileReader.readAsText(file);
        }).catch((err) => {
            this.setState({ errorMessage: 'User not Found', loading: false });
        })
    }

    render() {
        return (
            <div>
                <Container>
                    <Jumbotron>
                        <h1 className="mt-4 mb-4">Share File</h1>
                        <p>
                            Share Files with you Blockstack Friend<br></br>
                            Choose any file and the Blockstack username of your friend and file will be shared encrypted<br></br>
                            Only your friend will be able to access it
                        </p>
                    </Jumbotron>
                    {this.state.errorMessage ? <Alert className="mt-4 mb-4" variant='danger'>{this.state.errorMessage}</Alert> : ''}
                    {this.state.successMessage ? <Alert className="mt-4 mb-4" variant='success'>{this.state.successMessage}</Alert> : ''}
                    {this.state.loading ? <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />: ''}
                    <Form>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Receiver's Blockstack Username</Form.Label>
                                <Form.Control 
                                    onChange={this.onInputChange('username')} 
                                    type="text" 
                                    required
                                    placeholder="Enter Username" 
                                />
                                <Form.Text className="text-muted">
                                Enter here the Blockstack username of the receiver
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <Form.Group controlId="formFile">
                                <Form.Label>File to Share</Form.Label>
                                <Form.Control 
                                    onChange={this.onInputChange('file')} 
                                    type="file"
                                    accept='.json' 
                                    ref={this.fileInput}
                                    required
                                    placeholder="Enter File" 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="outline-primary" type="submit" onClick={ this.shareFile.bind(this) }>Share File</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
        );
    }
}