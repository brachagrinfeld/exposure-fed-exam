import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
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

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=all&per_page=100&format=json&safe_search=1&nojsoncallback=1&page=${this.state.page}`;
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
          const images = this.state.scrolling ? [...this.state.images, ...res.photos.photo]: res.photos.photo;
          this.setState({ images,  scrolling: false });
        }
      });
  }
  
  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
        scrolling: true
      },
      this.getImages(this.props.tag)
    );
  };

  handleScroll = () => {
    const lastImage = document.querySelector('div:last-child');
    const lastLiOffset = lastImage.offsetTop + lastImage.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    if (pageOffset >= lastLiOffset-1) {
          this.loadMore();
      }
  };

  onClone = (dto) => {
    const images = this.state.images;
    images.splice(images.findIndex(x => x.id === dto.id),0, dto);
    this.setState({ images });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.scrollListener = window.addEventListener("scroll", e => {
      this.handleScroll(e);
    });
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  
  }
  
  render() {
    let i = 1;
    return(
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + i++} dto={dto} galleryWidth={this.state.galleryWidth} 
                  onClone={this.onClone} tag={this.props.tag}/>;
        })}
      </div>
      );
    }
}

export default Gallery;