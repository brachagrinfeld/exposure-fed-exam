import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fasfaHeart, faDownload, faClone, faExpand, faArrowsAltH } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farfaHeart } from '@fortawesome/free-regular-svg-icons'

import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      isFlip: false,
      isBigger: false,
      style: {
        horizontal: false,
        orginal: true,
        bigger: false,
        favorite: false,
      }
    };
  }
  
  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size,
    });
  }

  checkFavorite(dto) {
    const favorites = localStorage.getObj("favorites") || [];
    const isFavorite = favorites[dto.id] ? true : false;
    this.setState({
      style: {...this.state.style, favorite: isFavorite }
    });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  toggleFlip = () => {
    const style = this.state.style;
    this.setState({ style: {...style, horizontal: !style.horizontal, orginal: !style.orginal} });   
  }

  onDownload = () => {
    const getImagesUrl = `services/rest/?method=flickr.photos.getSizes&api_key=522c1f9009ca3609bcbaf08545f067ad&format=json&safe_search=1&nojsoncallback=1&photo_id=${this.props.dto.id}`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data.sizes.size[0])
      .then(res => {
       const element = document.createElement('a');
       const file = new Blob([res.url]);
       element.href = URL.createObjectURL(file);
       element.download = 'image.jpg';
       element.click();

      });  
  }

  onExpand = () => {
    const style = this.state.style;
    this.setState({ style: {...style, bigger: !style.bigger} });
  }

  onClone = () => {
    this.props.onClone(this.props.dto);
  }

  markAsFavorite = () => {
    const favorites = localStorage.getObj("favorites") || {};
    const { dto, tag } = this.props;

    if(this.state.style.favorite) {
      delete favorites[dto.id];
      localStorage.setObj("favorites", favorites);
      this.props.onFavoritesChange && this.props.onFavoritesChange(dto);
    }
    else {
      favorites[dto.id] = Object.assign(dto, { tag });
      localStorage.setObj("favorites", favorites);
    }

    this.setState({ style: {...this.state.style, favorite: !this.state.style.favorite } });
  }

  componentDidMount() {
    this.calcImageSize();
    this.checkFavorite(this.props.dto);
  }

  componentWillReceiveProps(props) {
    this.checkFavorite(props.dto); 
  }
   
  render() {
    const imageClass = ["image-root"];
    const { style } = this.state;
    Object.keys(style).forEach(key => {
      if(style[key]) {
        imageClass.push(key);
      }  
    });

    const heartIcon = style.favorite ? fasfaHeart : farfaHeart;
    return (
      <div
        className={imageClass.join(' ')}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
          <i className="heart-circle"  onClick={this.markAsFavorite}>
            <FontAwesomeIcon icon={heartIcon} color="red" />
          </i>
        <div>
          <FontAwesomeIcon className="image-icon" icon={faArrowsAltH} title="flip" onClick={this.toggleFlip}/>
          <FontAwesomeIcon className="image-icon" icon={faClone} title="clone" onClick={this.onClone}/>
          <FontAwesomeIcon className="image-icon" icon={faExpand} title="expand" onClick={this.onExpand}/>
          <FontAwesomeIcon className="image-icon" icon={faDownload} title="download" onClick={this.onDownload}/>
        </div>
      </div>
    );
  }
}

export default Image;
