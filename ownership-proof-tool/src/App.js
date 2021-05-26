import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { decrypt, utils } from 'eciesjs'
import "./App.css";

function App() {

  const [tokenUri, setTokenUri] = React.useState(process.env.REACT_APP_TEST_TOKEN_URI);
  const [drmData, setDrmData] = React.useState(null);
  const [privateKey, setPrivateKey] = React.useState(process.env.REACT_APP_TEST_PRIVATE_KEY);
  const [decryptMsgData, setDecryptMsgData] = React.useState(null);

  function handleInputChange(event) {
    setTokenUri(event.target.value);
    GetTokenUriData(event.target.value)
  }

  function handlePrivateKeyChange(event) {
    setPrivateKey(event.target.value);
  }

  function handleDrmDataChange(event) {
    setDrmData(event.target.value);
  }

  function GetTokenUriData(tokenUri) {
    fetch(tokenUri)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setDrmData(data.drm_key)
   
    }).catch(error => console.log(error));
  }

  const handleGetDrmData = (evt) => {
    evt.preventDefault();
    GetTokenUriData(tokenUri)
  }

  const handleDecrypt = (evt) => {
    evt.preventDefault();
    let msg = decrypt(privateKey, utils.decodeHex(drmData)).toString()
    console.log(msg)
    setDecryptMsgData(msg)
  }

  React.useEffect(() => {
    // GET request using fetch inside useEffect React hook
  
        
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
  
  return (

      <Form className="p-5">       
        <FormGroup>
            <Label>Token URI</Label>
            <Input type="text" className="field" value={ tokenUri } onChange={ handleInputChange }/>
        </FormGroup>
        <FormGroup>
            <Button onClick={handleGetDrmData}>Get DRM Data</Button>    
        </FormGroup>
        <FormGroup>
            <Label>DRM Data</Label>
            <Input type="text"  className="field" value={ drmData } onChange={ handleDrmDataChange }/>  
        </FormGroup>  
        <FormGroup>   
            <Label for="privKey">Private Key</Label>
            <Input type="text" className="field" id="privKey" value={ privateKey } onChange={ handlePrivateKeyChange }/>    
        </FormGroup>  
        <FormGroup>   
          <Button  onClick={handleDecrypt}>Decrypt Data</Button>     
        </FormGroup>  

        <FormGroup>   
          <Label>Decrypt Data</Label>
          <Input type="text" className="field" id="decryptData" value={ decryptMsgData }/>  
        </FormGroup>   

      </Form>

  );
}

export default App;
