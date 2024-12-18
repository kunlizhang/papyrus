import React from 'react';
import Carousel from './Carousel';
import carouselData from '../assets/mock-recommendations.json';

export default function App() {

  return (
    <Carousel data={carouselData} />
  );
}
