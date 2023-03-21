import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import "./Home.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'


const Home = () => {

    const location = useLocation()

    useEffect(() => {
        const genrePageElement = document.getElementById('container');
        genrePageElement.innerHTML = '';

        if (location.pathname === '/') {
            createHomepage();
        }
        if (location.pathname === '/economics') {
            createGenrePage("Economics");
        }
        if (location.pathname === '/sport') {
            createGenrePage("Sport");
        }
        if (location.pathname === '/culture') {
            createGenrePage("Culture");
        }
        if (location.pathname === '/politics') {
            createGenrePage("Politics");
        }
        if (location.pathname === '/inland') {
            createGenrePage("Inland");
        }
        if (location.pathname === '/international') {
            createGenrePage("International");
        }
        if (location.pathname === '/science') {
            createGenrePage("Science");
        }
        if (location.pathname === '/productivity') {
            createGenrePage("Productivity");
        }
        if (location.pathname === '/wellness') {
            createGenrePage("Wellness");
        }
        if (location.pathname === '/health') {
            createGenrePage("Health");
        }
        if (location.pathname === '/mindfulness') {
            createGenrePage("Mindfulness");
        }
        if (location.pathname === '/joy') {
            createGenrePage("Joy");
        }
        // code to run after render goes here
    }, [location.pathname]);

    // krijg array van articles
    async function getArticles() {
        const response = await axios.get('http://localhost:4444/api/articles')
        return response.data
    }

    async function getGenres() {
        const articles = await getArticles()

        let agenres = new Set()
        for (const article of articles) {
            agenres.add(article.category)
        }
        return agenres

    }

    const Ge = getGenres()

    async function getLatestOfGenre() {
        const articles = await getArticles()

        var dict = {}
        for (const article of articles) {
            if (!dict.hasOwnProperty(article.category)) {
                dict[article.category] = article
            } else if (article.date_posted < dict[article.category].date_posted) {
                dict[article.category] = article
            }
        }
        return dict
    }

    const latestArt = getLatestOfGenre()
    console.log(latestArt)

    async function getArticlesGenrenum(genre, number) {
        let num = 0
        const articles = await getArticles()
        let articlesGenre = []

        for (const article of articles) {
            if (num >= number) {
                return (articlesGenre)

            }
            if (article.category === genre) {
                articlesGenre.push(article)
                num += 1
            }

        }
        return (articlesGenre)
    }

    async function getArticlesGenre(genre) {
        const articles = await getArticles()
        let articlesGenre = []
        for (const article of articles) {
            if (article.category === genre) {
                articlesGenre.push(article)
            }
        }
        return (articlesGenre)
    }

    {/**

     function carouselIt(index) {
    const articles = getLatestOfGenre();

    return articles.then(article => {
      console.log("heya")
      console.log(article['Health'])
      return (
        <Carousel.Item className='slide'>
          <img className="d-block w-100" src={article['Health'].image} alt="First slide" />
          <Carousel.Caption className="text">
            <NavLink to="/artikels">{article['Health'].title}</NavLink>
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  }
     */
    }

    const createGenrePage = async (genre) => {
        // Create the section title
        let ul = document.createElement('ul');
        ul.className = "list-inline mt-5 mb-0";

        let li = document.createElement('li');
        li.className = "list-inline-item";

        let sectietitel = document.createElement('h2');
        sectietitel.innerHTML = genre;

        li.appendChild(sectietitel);
        ul.appendChild(li);
        document.getElementById("container").appendChild(ul);

        const articles = await getArticlesGenre(genre);

        const rowDiv = document.createElement('div');
        rowDiv.className = "row p-2";

        // Loop through each article and create the DOM elements
        for (const article of articles) {
            // Create the card div
            let cardDiv = document.createElement('div');
            cardDiv.className = "col-sm-4 col-md-4 col-lg-4 mb-3";

            // Create the card element
            let card = document.createElement('div');
            card.className = "card";

            // Create the image element
            let img = document.createElement('img');
            img.src = article.image;
            img.className = "card-img-top";
            img.alt = "Article";
            img.style.height = "300px";
            img.style.objectFit = "cover";
            img.style.objectPosition = "center center";
            card.appendChild(img);

            // Create the card body div
            let cardBody = document.createElement('div');
            cardBody.className = "card-body";

            // Create the article title
            let ahref = document.createElement('a');
            ahref.href = article.references;
            ahref.className = "card-title";
            ahref.innerHTML = article.title;
            cardBody.appendChild(ahref);

            // Add card body to the card
            card.appendChild(cardBody);

            // Add the card to the cardDiv
            cardDiv.appendChild(card);

            // Add the cardDiv to the rowDiv
            rowDiv.appendChild(cardDiv);
        }
        document.getElementById("container").appendChild(rowDiv);
    };


    //Deze functie zal artikelen aan DOM van onze website toevoegen
    const createHomepage = async () => {
        const Genres = await getGenres()
        {/** const carouselItems = await getLatestOfGenre()

         //hier komt LatestArticles
         let ul = document.createElement('ul')
         ul.className = "list-inline mt-5 mb-0"

         let li = document.createElement('li')
         li.className = "list-inline-item"

         let li2 = document.createElement('li')
         li2.className = "list-inline-item"

         let sectietitel = document.createElement('h2')
         sectietitel.innerHTML = "Latest Articles"

         let linkSect = document.createElement('a')
         linkSect.href = '/artikels'
         linkSect.innerHTML = "See More"

         //create titleblock
         li.appendChild(sectietitel)
         li2.appendChild(linkSect)
         ul.appendChild(li)
         ul.appendChild(li2)

         document.getElementById("container").appendChild(ul);



         let carouselSection = document.createElement('section');
         carouselSection.className = "slider container mb-3";

         const carouselElement = document.createElement('div');
         carouselElement.className = 'carousel slide';
         carouselElement.setAttribute('data-ride', 'carousel');

         for (let genre in carouselItems) {
  let carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';

  let img = document.createElement('img');
  img.className = 'd-block w-100';
  img.src = carouselItems[genre].image;
  img.alt = 'slideX';

  let carouselCaption = document.createElement('div');
  carouselCaption.className = 'carousel-caption';

  let link = document.createElement('a');
  link.href = `/artikels/${carouselItems[genre].category}`;
  link.innerHTML = carouselItems[genre].title;

  carouselCaption.appendChild(link);
  carouselItem.appendChild(img);
  carouselItem.appendChild(carouselCaption);
  carouselElement.appendChild(carouselItem);
}

         carouselSection.appendChild(carouselElement);

         document.getElementById('container').appendChild(carouselSection);

         const carousel = new bootstrap.Carousel(carouselElement);
         */
        }


        for (const genre of Genres) {

            //hier komt de titel van de sectie
            let ul = document.createElement('ul')
            ul.className = "list-inline mt-5 mb-0"

            let li = document.createElement('li')
            li.className = "list-inline-item"

            let li2 = document.createElement('li')
            li2.className = "list-inline-item"

            let sectietitel = document.createElement('h2')
            sectietitel.innerHTML = genre

            let linkSect = document.createElement('a')
            linkSect.href = `/${genre.toLowerCase()}`
            linkSect.innerHTML = "See More"

            //create titleblock
            li.appendChild(sectietitel)
            li2.appendChild(linkSect)
            ul.appendChild(li)
            ul.appendChild(li2)

            document.getElementById("container").appendChild(ul);

            const articles = await getArticlesGenrenum(genre, 3)


            //create row div and assign classname to it
            const rowDiv = document.createElement('div');
            rowDiv.className = "row p-2";

            //loop door elke article en maak de juiste DOM elements
            for (const article of articles) {

                // create image for div underneath
                let img = document.createElement('img');
                img.src = article.image; //deze link moet normaal gezien onze api terug geve
                img.className = "d-block w-100";
                img.alt = "First slide"

                //create link to artikel
                let ahref = document.createElement('a');
                ahref.href = article.references // dees zal onze user moete navigate naar specifieke artikel
                ahref.innerHTML = article.title

                //create div class="col-sm-4 col-md-4 col-lg-4 text-left
                const textLeftDiv = document.createElement('div');
                textLeftDiv.className = "col-sm-4 col-md-4 col-lg-4 text-left";
                textLeftDiv.appendChild(img);
                textLeftDiv.appendChild(ahref)
                //add to parent div "row p-2"
                rowDiv.appendChild(textLeftDiv)
            }
            document.getElementById("container").appendChild(rowDiv);

        }
    }

    return (
        <div className="container" id="container">

            {/**
             * <section className="slider container mb-3">
             <Carousel>
             {console.log(carouselIt(0))}
             {carouselIt(1)}
             {carouselIt(2)}
             {carouselIt(3)}
             {carouselIt(4)}
             </Carousel>
             </section>
             *
             */}

        </div>
    );
};

export default Home;