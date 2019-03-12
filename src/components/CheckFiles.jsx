import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import FileItem from './FileItem.jsx';
import { decrypt } from './../utils/encryption';
import { 
    getFile, 
    loadUserData 
  } from 'blockstack';  

export default class CheckFiles extends Component {

  constructor (props) {
    super(props);

    this.state = {
      username: '',
      files: [],
      errorMessage: '',
      loading: false,
      progress: 0,
    };
  }

  onInputChange(property) {
      return (event) => {
          const value = event.target.value;
          this.setState({ [property]: value, files: [] });
      }
  }

  getFiles(e) {
      e.preventDefault();
      if(!this.state.username){
        this.setState({ errorMessage: "Enter sender username to search", loading: false });
        return
      }
      // Set progressBar
      this.setState({ loading: true, progress: 10, errorMessage: '' });

      const myUsername = loadUserData().username;
      const username = this.state.username;
      const privateKey = new Buffer(loadUserData().appPrivateKey, 'hex');
      // Get Public key of the User
      this.setState({ files: [], errorMessage: '' });
      getFile('files.json', { username: username, decrypt: false })
      .then((files) => {
        this.setState({ loading: true, progress: 20 });
        const myFiles = JSON.parse(files)[myUsername];
        myFiles.forEach( async (f) => {
          // Decrypt file
          return decrypt(privateKey, f.encrypted).then( decrypted => {
            f['decrypted'] = decrypted;
            // Add decrypted file to state
            const newFiles = this.state.files;
            newFiles.push(f);
            this.setState({ files: newFiles, progress: this.state.progress+Math.round(80/myFiles.length) });
          });
        })
      
        // Set Timeout to remove progress bar
        setTimeout(function() {
          this.setState({ loading: false })
        }.bind(this), 2000);

      }).catch((err) => {
        this.setState({ errorMessage: "No files Found", loading: false });
      })
  }

  render() {
      return (
          <div>
              <Container>
                <Jumbotron>
                    <h1 className="mt-4 mb-4">Check Files</h1>
                    <p>
                        Check and downlowd the Files that your friend habve shared with you<br></br>
                        Write the Blockstack username of your friend to check if you have any Files from he/she<br></br>
                        Only you can access Files shared to you
                    </p>
                </Jumbotron>
                {this.state.errorMessage ? <Alert className="mt-4 mb-4" variant='danger'>{this.state.errorMessage}</Alert> : ''}
                <Form>
                    <Row>
                        <Col md={4}>
                          <Form.Group controlId="formUsername">
                              <Form.Label>Sender's Blockstack Username</Form.Label>
                              <Form.Control 
                                  onChange={this.onInputChange('username')} 
                                  type="text" 
                                  required
                                  placeholder="Enter Username" 
                              />
                              <Form.Text className="text-muted">
                              Enter here the Blockstack username of the sender
                              </Form.Text>
                          </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                          <Button variant="outline-primary" type="submit" onClick={ this.getFiles.bind(this) }>Search Files</Button>
                        </Col>
                    </Row>
                </Form>
                              
                {this.state.username ? <h1 className='mt-4'>Files From: {this.state.username}</h1> : ''}
                {this.state.loading ? <ProgressBar className="mb-4" now={this.state.progress} label={`${this.state.progress}%`} />: ''}
                {this.state.files.map((f, index) => {
                  return (<FileItem title={'file #'+index} key={index} filename={f.filename} content={f.decrypted}/>) 
                })}
              </Container>
          </div>
      );
  }

}