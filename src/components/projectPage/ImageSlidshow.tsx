// Copied from https://react-slideshow-image.netlify.app/?path=/docs/introduction--page

import React, { Component } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

interface SlideShowProps {
  imgs: string[]
}



export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true
    };
    return (
      <div style={{
        // display: 'flex'
        // width: 200px
      }}>
        {/* <h2> Single Item</h2> */}
        <Slider {...settings}>
          <div>
            <img src="src/components/projectPage/galleryImgs/img1.png" />
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    );
  }
}