import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import './App.scss';
import Gallery from '../Gallery';
import Favorites from '../Favorites';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    return (
      <div className="app-root">
        <BrowserRouter>
          <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
            <Navbar.Brand>Flickr Gallery</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">All</Nav.Link>
                <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div>
          <Route exact path='/' component={Gallery}/>
            <Route exact path="/favorites" component={Favorites} />
          </div>
        </BrowserRouter>      
      </div>
    );
  }
}

export default App;
