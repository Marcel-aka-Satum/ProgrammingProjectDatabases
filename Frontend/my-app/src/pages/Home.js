import React from 'react'
import { NavLink } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import example1 from "./example1.jpg"
import example2 from "./example2.png"
import example3 from "./example3.png"
import {useEffect, useRef} from "react";
import "./Home.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const Home = () => {
  
  useEffect(() => {
    // code to run after render goes here
  },[]);

let Headers = ["Latest News", "Economics", "Sports", "Politics", "International", "Inland"]
let header = 'hallo'

function CreateHomepage () {
  return(
    <div>
      <ListGroup className="list-inline mt-3 mb-0">
        <ListGroupItem className="list-inline-item">
          <h1>{header}</h1>
        </ListGroupItem>
        <ListGroupItem className="list-inline-item">
          <NavLink to={`/artikels/${header}`}>See More</NavLink>
        </ListGroupItem>
      </ListGroup>
      <div className="row p-2">
        <div className="col-sm-4 col-md-4 col-lg-4 text-left">
          <img className="d-block w-100" src={example1} alt="article" />
          <NavLink to={`/artikels/${header}`}>title</NavLink>
        </div>
      </div>
    </div>
);

  }

function CHomepage () {
  while (Homepage.current.firstChild) Homepage.current.removeChild(Homepage.current.firstChild)

  Headers.forEach(header=>{

    const list = (
      <ListGroup className="list-inline mt-3 mb-0">
        <ListGroupItem className="list-inline-item">
          <h1>{header}</h1>
        </ListGroupItem>
        <ListGroupItem className="list-inline-item">
          <NavLink to={`/artikels/${header}`}>See More</NavLink>
        </ListGroupItem>
      </ListGroup>
    );
    Homepage.current.appendChild(list)

    let articles = (
      <div className="row p-2">
        <div className="col-sm-4 col-md-4 col-lg-4 text-left">
          <img className="d-block w-100" src={example1} alt="article" />
          <NavLink to={`/artikels/${header}`}>title</NavLink>
        </div>
      </div>
    );
    Homepage.current.appendChild(articles);
    console.log('hallo')
  });

  }


  const Articles = [
    {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
    {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
    {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
    {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
    {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
  ];
  return (
    <div class="container">
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

    <CreateHomepage />
  </div> 
);
};

export default Home
