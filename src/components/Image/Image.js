import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fasfaHeart, faClone, faExpand, faArrowsAltH, faCropAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farfaHeart } from '@fortawesome/free-regular-svg-icons'

import './Image.scss';
import CropImage from '../CropImage';

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
      dto: null,
      src: null,
      showCrop: false,
      size: 200,
      isFlip: false,
      isBigger: false,
      style: {
        horizontal: false,
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
    this.setState({ style: {...style, horizontal: !style.horizontal} });   
  }

  onCrop = () => {
    this.setState({ showCrop: true });
  }

  onExpand = () => {
    const style = this.state.style;
    this.setState({ style: {...style, bigger: !style.bigger} });
  }

  onClone = () => {
    this.props.onClone(this.props.dto);
  }

  OnImageCrop = (src) => {
    this.setState({ showCrop: !this.state.showCrop, src: src}) 
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
      favorites[dto.id] = Object.assign(dto, { tag, src: this.state.src });
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
    const { style, showCrop } = this.state;
    const imageWarpClass = ['image-root', style.bigger ? 'bigger': 'orginal'];
    const imageClass = ['image-style', style.horizontal ? 'horizontal': 'orginal'];
    
    const heartIcon = style.favorite ? fasfaHeart : farfaHeart;
    return (
      <div className={imageWarpClass.join(' ')}
      style={{
        width: this.state.size + 'px',
        height: this.state.size + 'px'
      }}>
      <CropImage show = { showCrop }
                 onHide = { this.OnImageCrop }
                 image = { this.urlFromDto(this.props.dto) }></CropImage>         
      <img src={this.state.src || this.props.dto.src || this.urlFromDto(this.props.dto)}
          className = {imageClass.join(' ')}
          style = {{
            width: this.state.size + 'px',
            height: this.state.size + 'px',
          }}
      ></img> 
          <FontAwesomeIcon className="heart-circle" icon={heartIcon} color="red"  onClick={this.markAsFavorite} />
        <div>
          <FontAwesomeIcon className="image-icon" icon={faArrowsAltH} title="flip" onClick={this.toggleFlip}/>
          <FontAwesomeIcon className="image-icon" icon={faClone} title="clone" onClick={this.onClone}/>
          <FontAwesomeIcon className="image-icon" icon={faExpand} title="expand" onClick={this.onExpand}/>
          <FontAwesomeIcon className="image-icon" icon={faCropAlt} title="crop" onClick={this.onCrop}/>
        </div>
      </div>
    );
  }
}
export default Image;
