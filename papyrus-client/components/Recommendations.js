import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import Carousel from './Carousel';

export default function App() {
  const carouselData = ['Card 1', 'Card 2', 'Card 3', 'Card 4'];

  return (
    <Carousel data={carouselData} />
  );
}
