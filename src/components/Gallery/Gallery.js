import React from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';
import { Form, FormControl, Button } from 'react-bootstrap';

import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {

  static propTypes = {

  }
  constructor(props) {
    super(props);
    this.state = {
      tag: 'any',
      images: [],
      scrolling: false,
      galleryWidth: this.getGalleryWidth(),
      page: 1
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages = () => {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${this.state.tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1&page=${this.state.page}`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          const images = this.state.scrolling ? [...this.state.images, ...res.photos.photo] : res.photos.photo;
          this.setState({ images, scrolling: false });
        }
      });
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
        scrolling: true
      },
      this.getImages()
    );
  };

  handleScroll = () => {
    const lastImage = document.querySelector('div:last-child');
    const lastLiOffset = lastImage.offsetTop + lastImage.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    if (pageOffset >= lastLiOffset - 1) {
      this.loadMore();
    }
  };

  onClone = (dto) => {
    const images = this.state.images;
    images.splice(_.findIndex(images, dto), 0, dto);
    this.setState({ images });
  }

  onChangeTag = (event) => {
    event.preventDefault();
    this.setState({tag: event.currentTarget.elements[0].value}, () => this.getImages());
  }
  componentDidMount() {
    this.getImages();
    this.scrollListener = window.addEventListener('scroll', this.handleScroll);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}

  render() {
    let i = 1;
    return (
      <div className="gallery-warper">
        <Form inline className='form-tag' onSubmit={this.onChangeTag}>
          <FormControl type="text" placeholder="Insert tag" className="mr-sm-2 tag-text-box" />
          <Button variant="dark" type='submit'>Get Images</Button>
        </Form>
        <div className="gallery-root">
          {this.state.images.map(dto => {
            return <Image key={'image-' + i++} dto={dto} galleryWidth={this.state.galleryWidth}
              onClone={this.onClone} tag={this.state.tag} />
          })}
        </div>
      </div>
    );
  }
}

export default Gallery;