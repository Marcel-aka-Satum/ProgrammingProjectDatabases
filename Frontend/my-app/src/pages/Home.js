import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Modal} from "bootstrap";

function addDashes(str) {
    return str.replace(/\s+/g, '-');
}

function formatTitle(str) {
    const words = str.split('-');
    const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function formatSummary(text, url, limit = 200) {
    if (text.length <= limit) {
        return [text, false];
    } else {
        const id = urlToSelector(url);
        const truncatedText = text.slice(0, limit);
        const remainingText = text.slice(limit);
        return [truncatedText.trim() + '...', true];
    }
}


function urlToSelector(url) {
    const base64Url = btoa(url);
    const sanitizedUrl = base64Url.replace(/=/g, ''); // remove padding characters
    return sanitizedUrl;
}

const Home = () => {

    const location = useLocation()
    const pathWithDashes = addDashes(location.pathname);

    useEffect(() => {
        const genrePageElement = document.getElementById('container');
        genrePageElement.innerHTML = '';


        if (location.pathname === '/') {
            createHomepage();
        } else if (location.pathname === '/economics') {
            createGenrePage("Economics");
        } else if (location.pathname === '/sport') {
            createGenrePage("Sport");
        } else if (location.pathname === '/culture') {
            createGenrePage("Culture");
        } else if (location.pathname === '/politics') {
            createGenrePage("Politics");
        } else if (location.pathname === '/inland') {
            createGenrePage("Inland");
        } else if (location.pathname === '/international') {
            createGenrePage("International");
        } else if (location.pathname === '/science') {
            createGenrePage("Science");
        } else if (location.pathname === '/health') {
            createGenrePage("Health");
        } else {
            createGenrePage(window.location.pathname.substring(1), true);
        }

        // code to run after render goes here
    }, [pathWithDashes]);

    // krijg array van articles
    async function getArticles() {
        const response = await axios.get('http://localhost:4444/api/articles')
        console.log('articles: ', response.data)
        return response.data
    }

    async function getGenres() {
        const articles = await getArticles()

        let agenres = new Set()
        for (const article of articles) {
            agenres.add(article.Topic)
        }
        return agenres

    }

    const Ge = getGenres()

    async function getLatestOfGenre() {
        const articles = await getArticles()

        var dict = {}
        for (const article of articles) {
            if (!dict.hasOwnProperty(article.Topic)) {
                dict[article.Topic] = article
            } else if (article.date_posted < dict[article.Topic].date_posted) {
                dict[article.Topic] = article
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
            if (article.Topic === genre) {
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
            if (article.Topic === genre) {
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
          <img className="d-block w-100" src={article['Health'].Image} alt="First slide" />
          <Carousel.Caption className="text">
            <NavLink to="/artikels">{article['Health'].Title}</NavLink>
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  }
     */
    }

    const createGenrePage = async (genre, dynamic = false) => {
        if (dynamic) {
            genre = formatTitle(genre);
        }
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

        console.log('genre:', genre)
        const articles = await getArticlesGenre(genre);

        const rowDiv = document.createElement('div');
        rowDiv.className = "row";

        // Loop through each article and create the DOM elements
        for (const article of articles) {
            // Create the card div
            let cardDiv = document.createElement('div');
            cardDiv.className = "col-4 mb-3";

            // Create the card element
            let card = document.createElement('div');
            card.className = "card article-card";

            // check if it has an image
            if (article.Image) {
                // Create the image element
                let img = document.createElement('img');
                img.src = article.Image;
                img.className = "card-img-top";
                img.alt = "Article";
                img.style.height = "300px";
                img.style.objectFit = "cover";
                img.style.objectPosition = "center center";
                card.appendChild(img);
            }


            // Create the card body div
            let cardBody = document.createElement('div');
            cardBody.className = "card-body";

            // Create the article title
            let ahref = document.createElement('a');
            ahref.href = article.URL;
            ahref.className = "card-title";
            ahref.innerHTML = article.Title;
            ahref.target = "_blank";
            cardBody.appendChild(ahref);

            // Create the article description
            let p = document.createElement('p');
            p.className = "card-text";
            const [text, hasMoreText] = formatSummary(article.Summary, article.URL, 200);
            p.innerHTML = text;
            cardBody.appendChild(p);

            // Create the article date
            let date = document.createElement('p');
            date.className = "card-text float-end";
            date.innerHTML = formatDate(article.Published);
            cardBody.appendChild(date);

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
  img.src = carouselItems[genre].Image;
  img.alt = 'slideX';

  let carouselCaption = document.createElement('div');
  carouselCaption.className = 'carousel-caption';

  let link = document.createElement('a');
  link.href = `/artikels/${carouselItems[genre].Topic}`;
  link.innerHTML = carouselItems[genre].Title;

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
            linkSect.href = `/${addDashes(genre.toLowerCase())}`
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
                img.src = article.Image; //deze link moet normaal gezien onze api terug geve
                img.className = "d-block w-100";
                img.alt = "First slide"

                //create link to artikel
                let ahref = document.createElement('a');
                ahref.href = article.URL // dees zal onze user moete navigate naar specifieke artikel
                ahref.innerHTML = article.Title

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