import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import App from './App.js';
import { Nav } from 'react-bootstrap';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <App />,
      { attachTo: document.createElement('div') }
    );
  });

  afterEach(() => wrapper.detach());

  it('renders nav correctly', () => {
    expect(wrapper.find(Nav).length).to.eq(1);
  });

  it('renders the nav-link correctly', () => {
    expect(wrapper.find(Nav.Link).length).to.eq(2);
  });
});
