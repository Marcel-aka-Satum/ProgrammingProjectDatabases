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
import axios from 'axios'


const Home = () => {
  useEffect(() => {
    // code to run after render goes here
    createHomepage();
  },[]);

  // krijg array van articles
  function getArticles(){
    return axios.get('http://localhost:4444/api/articles').then(response => response.data)
  }


  //Deze functie zal artikelen aan DOM van onze website toevoegen
  const createHomepage = () => {
    //get articles
    const articles = getArticles()

    //create row div and assign classname to it
    const rowDiv = document.createElement('div');
    rowDiv.className = "row p-2";
    
    //loop door elke article en maak de juiste DOM elements
    articles.then(response => {
      for(let i = 0; i < response.length; i++){
      // create image for div underneath
      let img = document.createElement('img');
      img.src = response[i].image; //deze link moet normaal gezien onze api terug geve
      img.className = "d-block w-100";
      img.alt = "First slide"

      //create link to artikel
      let ahref = document.createElement('a');
      ahref.href="/artikels" // dees zal onze user moete navigate naar specifieke artikel
      ahref.innerHTML = "Go to article"

      //create div class="col-sm-4 col-md-4 col-lg-4 text-left
      const textLeftDiv = document.createElement('div');
      textLeftDiv.className = "col-sm-4 col-md-4 col-lg-4 text-left";
      textLeftDiv.appendChild(img);
      textLeftDiv.appendChild(ahref);
      //add to parent div "row p-2"
      rowDiv.appendChild(textLeftDiv);
      }
    })

    //add html to DOM of the website
    document.body.appendChild(rowDiv);
    
    //VOORBEELD HTML 
    // <div class="row p-2">
    //   <div class="col-sm-4 col-md-4 col-lg-4 text-left">
    //     <img className="d-block w-100" src= {example1} alt="First slide"/>
    //     <NavLink to="/artikels">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</NavLink>
    //   </div>
    //   <div class="col-sm-4 col-md-4 col-lg-4 text-left">
    //     <img className="d-block w-100" src= {example1} alt="First slide"/>
    //     <NavLink to="/artikels">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </NavLink>
    //   </div>
    //   <div class="col-sm-4 col-md-4 col-lg-4 text-left">
    //   <img className="d-block w-100" src= {example1} alt="First slide"/>
    //   <NavLink to="/artikels">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </NavLink>
    //   </div>
    // </div>
  }

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
            <NavLink to="/artikels">ga naar artikel</NavLink>
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
  </div> 
);
};

export default Home
