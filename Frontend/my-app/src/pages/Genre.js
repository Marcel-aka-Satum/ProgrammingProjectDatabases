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

                <div className="article-card-date pb-3 pt-3 float-end">
                    <i>{formatDate(article.Published)}</i>
                </div>

            </div>
        </div>
    );
}


const Home = () => {
    const genre = useLocation().pathname.split('/')[2];
    const [articles, setArticles] = useState([])

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.get('http://localhost:4444/api/articles');
            const filteredArticles = response.data.filter(article => article.Topic === formatTitle(genre));
            setArticles(filteredArticles);
        };
        fetchArticles();
    }, []);

    return (
        <div className="row">
            <h2 className="text-center text-dark mt-5">Articles for {formatTitle(genre)}</h2>
            <ul className="articles-row">
                {articles.map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
