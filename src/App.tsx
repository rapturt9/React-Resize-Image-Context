import React from 'react';
import logo from './logo.svg';
import Image from './Image';
import './App.css';

function App() {
  return (
    <div className="App">
      <Image 
        height={400}
        width={400}
        src={"https://imagesvc.meredithcorp.io/v3/jumpstartpure/image/?url=https%3A%2F%2Fcf-images.us-east-1.prod.boltdns.net%2Fv1%2Fstatic%2F3281700261001%2F6a204d6b-0fe4-45c8-a63e-b2e09c11de32%2Fa13648d5-c0b9-4ded-8ecd-89aad8634e6c%2F1280x720%2Fmatch%2Fimage.jpg&w=640&h=360&q=90&c=cc"}
        />
    </div>
  );
}

export default App;
