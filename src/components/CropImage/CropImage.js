import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';

import './CropImage.scss';
class CropImage extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    image: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: '%',
        width: 30,
        aspect: 1
      }
    };
  }

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  onCloseCancel = () => {
    this.props.onHide()
  }
  onCloseSave = () => {
    this.props.onHide(this.state.croppedImageUrl)
  }

 

  render() {
    const { crop } = this.state;

    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Crop Image
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="crop">
            <ReactCrop
              crossorigin="Anonymous"
              src={this.props.image}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button onClick={this.onCloseCancel}>Cancel</Button>
          <Button onClick={this.onCloseSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default CropImage;
