'use strict';

require('babel-polyfill');
require('core-js/fn/object/assign');

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
// Add support for all files in the test directory
const testsContext = require.context('../src/components', true, /(spec\.js$)|(Helper\.js$)/);
testsContext.keys().forEach(testsContext);
