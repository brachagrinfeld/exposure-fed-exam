// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1111;

  const mountImage = () => {
    return shallow(
      <Image key={'image-'+sampleImage.id} dto={sampleImage} galleryWidth={galleryWidth}/>,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('render 4 icons on each image', () => {
    const iconsWarpper = wrapper.find('.icons');
    expect(iconsWarpper.find('FontAwesomeIcon').length).to.equal(4);
  });

  it('calc image size on mount', () => {
    const spy = sinon.spy(Image.prototype, 'calcImageSize');
    wrapper = mountImage();
    expect(spy.called).to.be.true;
  });

  it('calculate image size correctly', () => {
    const imageSize = wrapper.state().size;
    const remainder = galleryWidth % imageSize;
    expect(remainder).to.be.lessThan(1);
  });

});
