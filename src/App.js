import React from 'react';
import './App.css';
import Content from './components/Content'


function App(){
  const title ={
    background: '#2a9d8f',
    color : 'white',
    height: '100px',
    textAlign: 'center',
    paddingTop: '10px',
    fontSize: '25px',
    boxShadow: '3px 3px 3px #adb5bd',
}

const footer = {
    marginTop: '300px',
    background: '#2a9d8f',
    color : 'white',
    height: '100px',
    textAlign: 'center',
    fontSize: '15px',
    boxShadow: '3px 3px 4px 4px #adb5bd',
    paddingTop: '10px',
    zIndex: '1',
}
 
    return (
      <div className="App">
        <div style = {title}>
          <h1>Beam Solver v1.0</h1>
        </div>
        <Content/>
        <div style = {footer}>
          <footer><h3>Made by Jack Zhen, Civil Engineer, SJSU 2020</h3></footer> 
          <footer><h3>Check me out at:</h3></footer>
          <footer><h3><a href = 'https://www.linkedin.com/in/jackzhen/'>Linkedin</a></h3></footer>
        </div>
      </div>
    );
}

export default App;
