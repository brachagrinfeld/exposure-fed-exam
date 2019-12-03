import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      isFlip: false,
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

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  toggleFlip = () => {
    this.setState({ isFlip: !this.state.isFlip });
  }

  onClone = () => {
    this.props.onClone(this.props.dto);
  }
  
  render() {
    const imageClass = ["image-root"];

    if(this.state.isFlip) {
      imageClass.push('horizontal');
    }
    else {
      imageClass.push('orginal');
    }

    return (
      <div
        className={imageClass.join(' ')}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div>
          <FontAwesome className="image-icon" name="arrows-alt-h" title="flip" onClick={this.toggleFlip}/>
          <FontAwesome className="image-icon" name="clone" title="clone" onClick={this.onClone}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
