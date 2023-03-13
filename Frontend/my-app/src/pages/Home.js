import React from 'react'
import { NavLink } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import example1 from "./example1.jpg"
import example2 from "./example2.png"
import example3 from "./example3.png"
import "./Home.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Row } from 'react-bootstrap'

const Home = () => {
  return (
    <div class="container">
      <ul class="list-inline mt-2 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Latest Articles</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <section className="slider container mb-3">
      <Carousel>
        <Carousel.Item className='slide'>
          <img className="d-block w-100" src= {example1} alt="First slide"/>
          <Carousel.Caption class="text">
            <NavLink to="/artikels">helalalalalalalalalalalalalalalalalalalalalal alalalalalalalalallalalalalalala lalalalalalalalalalalal</NavLink>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item className='slide'>
          <img className="d-block w-100" src={example2} alt="Second slide"/>
          <Carousel.Caption class="text">
            <h4>Titel2</h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className='slide'>
          <img className="d-block w-100" src={example3} alt="Third slide"/>
          <Carousel.Caption class="text">
            <h4>Titel3</h4>
          </Carousel.Caption>
        </Carousel.Item>   
        </Carousel> 
    </section>
    
    <h2>Hot Topics</h2>
    <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-center">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-center">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-center">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      </div>
    </div>


  </div>
);
};

export default Home