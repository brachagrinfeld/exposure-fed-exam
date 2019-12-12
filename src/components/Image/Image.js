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
      showCrop: false,
      size: 200,
      isFlip: false,
      isBigger: false,
      style: {
        horizontal: false,
        bigger: false,
        favorite: false
      }
    };
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  checkFavorite(dto) {
    const favorites = localStorage.getObj('favorites') || [];
    const isFavorite = favorites[dto.id] ? true : false;
    this.setState({
      style: { ...this.state.style, favorite: isFavorite }
    });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  toggleFlip = () => {
    const style = this.state.style;
    this.setState({ style: { ...style, horizontal: !style.horizontal } });
  }

  onCrop = () => {
    this.setState({ showCrop: true });
  }

  onExpand = () => {
    const style = this.state.style;
    this.setState({ style: { ...style, bigger: !style.bigger } });
  }

  onClone = () => {
    this.props.onClone(this.props.dto);
  }

  onImageCrop = (src) => {
    const favorites = localStorage.getObj('favorites');
    this.setState({ showCrop: !this.state.showCrop, dto: { ...this.state.dto, src: src || this.state.dto.src } }, () => {
    if(favorites[this.state.dto.id]) {
      favorites[this.state.dto.id] = {...favorites[this.state.dto.id], src};
      localStorage.setObj('favorites', favorites);
    }})
  }

  markAsFavorite = () => {
    const favorites = localStorage.getObj('favorites') || {};
    const { dto } = this.state;

    if (this.state.style.favorite) {
      delete favorites[dto.id];
      localStorage.setObj('favorites', favorites);
      this.props.onFavoritesChange && this.props.onFavoritesChange(dto);
    }
    else {
      favorites[dto.id] = {...dto, originSrc: dto.src};
      localStorage.setObj('favorites', favorites);
    }

    this.setState({ style: { ...this.state.style, favorite: !this.state.style.favorite } });
  }

  async componentWillMount (){
    const src= this.urlFromDto(this.props.dto);
    const dto = { ...this.props.dto, tag: this.props.tag, src: this.props.dto.src || src, originSrc: this.props.dto.src || src };
    await this.setState({ dto });
  }

   componentDidMount() {
    this.calcImageSize();
    this.checkFavorite(this.props.dto);
  }

  async componentWillReceiveProps(props) {
    const src= this.urlFromDto(props.dto);
    const dto = { ...props.dto, tag: props.tag, src: props.dto.src || src, originSrc: props.dto.src || src };
    this.setState({ dto });
    this.checkFavorite(props.dto);

  }

  render() {
    const { style, showCrop } = this.state;
    const imageWarpClass = ['image-root', style.bigger ? 'bigger' : 'orginal'];
    const imageClass = ['image-style', style.horizontal ? 'horizontal' : 'orginal'];

    const heartIcon = style.favorite ? fasfaHeart : farfaHeart;
    return (
      <div className={imageWarpClass.join(' ')}
        style={{
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}>
        <CropImage show={showCrop}
          onHide={this.onImageCrop}
          image={this.state.dto.originSrc}></CropImage>
        <img src={this.state.dto.src}
          className={imageClass.join(' ')}
          style={{
            width: this.state.size + 'px',
            height: this.state.size + 'px'
          }}
        ></img>
        <FontAwesomeIcon className="heart-circle" icon={heartIcon} color="red" onClick={this.markAsFavorite} />
        <div className='icons'>
          <FontAwesomeIcon className="image-icon" icon={faArrowsAltH} title="flip" onClick={this.toggleFlip} />
          {this.props.onClone && <FontAwesomeIcon className="image-icon" icon={faClone} title="clone" onClick={this.onClone} />}
          <FontAwesomeIcon className="image-icon" icon={faExpand} title="expand" onClick={this.onExpand} />
          <FontAwesomeIcon className="image-icon" icon={faCropAlt} title="crop" onClick={this.onCrop} />
        </div>
      </div>
    );
  }
}
export default Image;
