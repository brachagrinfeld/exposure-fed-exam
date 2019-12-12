import React from 'react';
import { Nav, Tab, Row, Col } from 'react-bootstrap';

import Image from '../Image';
import Toaster from '../Toaster';
import './Favorites.scss';

class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToater: false,
      images: {}
    };
  }
  
  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages() {
    const favorites = localStorage.getObj('favorites') || {};
    const imagesSplit = Object.values(favorites).reduce((acc, dto) => {
      acc[dto.tag] = [...(acc[dto.tag] || []), dto];
      return acc;
    }, {});
    this.setState({ images: imagesSplit });
  }
  
  onFavoritesChange = (dto) => {
    this.setState({
                    showToaster: true,
                    imageDeleted:  dto
                  });
    this.getImages();
  }

  onRestore = () => {
    const favorites = localStorage.getObj('favorites') || {};
    const { imageDeleted } = this.state;
    favorites[imageDeleted.id] = imageDeleted;
    localStorage.setObj('favorites', favorites);
    this.getImages();
    this.onToasterClose();
  }

  onToasterClose = () => {
    this.setState({
      showToaster: false,
      imageDeleted: null
    });
  }

  componentWillMount() {
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    this.getImages();
  }
  
  render() {
    const tags = Object.keys(this.state.images);
    const { images } = this.state;
    return(
      <div className="favorites-root">
        <Tab.Container id="left-tabs-example" defaultActiveKey={tags[0]}>
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {tags.map((tag) => {
                  return  <Nav.Item>
                             <Nav.Link eventKey={tag}>{tag}</Nav.Link>
                          </Nav.Item>;
                  })}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content className="gallery-root">
              {tags.map((tag) => {
                  return <Tab.Pane eventKey={tag}>
                {images[tag].map(dto => {
                  return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
                          onFavoritesChange={this.onFavoritesChange} tag={dto.tag}/>;
                })}
                  </Tab.Pane>;
                  })}
              </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        {
        this.state.showToaster &&
          <Toaster onClose={this.onToasterClose} onRestore={this.onRestore} ></Toaster>
        }
      </div>
      );
    }
  }

export default Favorites;