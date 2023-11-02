import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Instruments.css'; 

/*

Component: ImageCarousel

Handles displaying instrument images by implementing react-responsive-carousel.  

Props: 
 - images: the intrument images, passed from parent.

Parents: ShopifyStore
Children: 

*/

const ImageCarousel = ({ images }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <div key={index} className='image-gallery2'>
          <img src={image.src} alt={`Image ${index}`} />
          <p className="legend">{image.caption}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;

