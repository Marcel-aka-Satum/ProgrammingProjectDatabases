import React from 'react'
import { NavLink } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import example1 from "./example1.jpg"
import example2 from "./example2.png"
import example3 from "./example3.png"
import "./Home.css"
import 'bootstrap/dist/css/bootstrap.min.css'

const Home = () => {
  return (
    <div class="container">
      <ul class="list-inline mt-3 mb-0">
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
    
    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Hot Topics</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
    <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
      </div>

      <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Economics</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Culture</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Sport</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Politics</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Inland</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>International</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>

    <ul class="list-inline mt-5 mb-0">
        {/*hallo*/}
        <li class="list-inline-item"><h2>Other</h2></li>
        <li class="list-inline-item"><NavLink to="/artikels">see More</NavLink></li>
      </ul>
      <div class="row p-2">
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
        <img className="d-block w-100" src= {example1} alt="First slide"/>
        <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 text-left">
      <img className="d-block w-100" src= {example1} alt="First slide"/>
      <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
      </div>
    </div>
  </div>
);
};

export default Home