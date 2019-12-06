require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import App from './App';

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <App/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
