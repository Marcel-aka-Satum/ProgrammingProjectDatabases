import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'


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
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function formatSummary(text, url, limit = 200) {
    if (text.length <= limit) {
        return [text, false];
    } else {
        const truncatedText = text.slice(0, limit);
        const remainingText = text.slice(limit);
        return [truncatedText.trim() + '...', true];
    }
}

function compareDates(a, b) {
    const dateA = new Date(a.Published);
    const dateB = new Date(b.Published);

    if (dateA > dateB) {
        return -1;
    }
    if (dateA < dateB) {
        return 1;
    }
    return 0;
}

function ArticleCard({article}) {
    return (
        <div className="article-card">
            <img src={article.Image} alt='' className="img-fluid pb-3"/>

            <div className="article-card-body pe-3 ps-3">
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <h4 className="article-card-title">{formatTitle(article.Title)}</h4>
                </a>

                <div className="article-card-content"
                     dangerouslySetInnerHTML={{__html: formatSummary(article.Summary)[0]}}
                />

                <div className="article-card-footer pb-3 float-end">
                    <span className="article-card-date">
                        <i>{formatDate(article.Published)}</i>
                    </span>
                </div>

            </div>
        </div>
    );
}

function GenreSection({genre, articles}) {
    function addDashes(str) {
        return str.replace(/\s+/g, '-');
    }

    return (
        <div className="genre-section">
            <h2>
                {genre}{' '}
                <button className="btn btn-outline-secondary">
                    <a href={`genre/${addDashes(genre)}`} target='_blank'>Show All</a>
                </button>
            </h2>
            <ul className="articles-row">
                {articles.slice(0, 3).map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Home = () => {
    const location = useLocation()

    const [articles, setArticles] = useState([])
    const [genres, setGenres] = useState(new Set())
    const [articlesGenre, setArticlesGenre] = useState([])

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.get('http://localhost:4444/api/articles');
            // const limitedArticles = response.data.slice(0, 500);

            setArticles(response.data);
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const fetchGenres = () => {
            const uniqueGenres = new Set();
            const grouped = {};

            for (const article of articles) {
                uniqueGenres.add(article.Topic);

                if (!grouped[article.Topic]) {
                    grouped[article.Topic] = [];
                }
                grouped[article.Topic].push(article);
            }

            setGenres(uniqueGenres);
            setArticlesGenre(grouped);
        };

        if (articles.length > 0) {
            fetchGenres();
        }
    }, [articles]);

    articles.sort(compareDates);

    return (
        <div className="container-lg pt-5">
            <div className="row">
                {Array.from(genres).map((genre) => (
                    <GenreSection
                        key={genre}
                        genre={genre}
                        articles={articlesGenre[genre]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
