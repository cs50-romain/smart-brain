import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Signin from './component/Signin/Signin'
import Register from './component/Register/Register'
import ParticlesBg from 'particles-bg'
import React, {Component} from 'react';

const returnClarifaiJSONRequest = (imgURL) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '76cc5cca52d24cfd8c5dc1a46f2d96ca';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = '722hj8asyy9j';       
  const APP_ID = 'my-first-application-hvnli6';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-recognition';
  const IMAGE_URL = imgURL;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;
}

const initialState = {
   input: '',
   imageURL: '',
   box: {},
   route: 'signin_page',
   signedIn: false,
   user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = initialState
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  
  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }

  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onSubmit = () => {
    this.setState({imageURL: this.state.input})
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiJSONRequest(this.state.input))
    .then(response => response.json())
    .then(result => {
      result.outputs[0].data.regions.forEach( (face) => this.displayFaceBox(this.calculateFaceLocation(result)))
    })
      /*.then(response => response.json())
      .then(result =>{
        //result.outputs[0].data.regions[0].region_info.bounding_box
        const facesArray = result.outputs[0].data.regions
        facesArray.forEach( (face) => console.log(face.region_info.bounding_box))
      })*/
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signin_page'){
      this.setState(initialState)
    } else {
      this.setState({signedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true}/>
        <Navigation signedIn={this.state.signedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'signin_page' ? <Signin onRouteChange={this.onRouteChange}/>
          : this.state.route === 'register' ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <div>
              <Logo />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
            </div>
        }
      </div>
    );
  }
}

export default App;
