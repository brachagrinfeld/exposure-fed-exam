import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { Toast } from 'react-bootstrap';

import './Toaster.scss';
class Toaster extends React.Component {

  constructor(props) {
    super(props);
  }

  onRestore = () => {
    this.props.onRestore();
  }
  
  render() {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          position: 'fixed',
          bottom: 0,
          left: 0,
          minHeight: '100px',
          minWidth: '500px',
        }}>
        <Toast
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            minWidth: '500px',
          }}
          onClose={this.props.onClose}
          delay={5000} autohide
          variant='dark'
        >
          <Toast.Header>
            <strong className="mr-auto">The image deleted</strong>
          </Toast.Header>
          <Toast.Body>
            <span>Do you want to restore?</span>
            <FontAwesomeIcon className="restore-icon" icon={faRedoAlt} title="restore" onClick={this.onRestore}/>
          </Toast.Body>
        </Toast>
    </div>
    );
  }
}

export default Toaster;
