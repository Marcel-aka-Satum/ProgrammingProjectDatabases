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
        return [truncatedText.trim() + '...', true];
    }
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
    const [filterText, setFilterText] = useState('');
    const [sortOption, setSortOption] = useState("Sort By");
    const [numDisplayedArticles, setNumDisplayedArticles] = useState(20);

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.get('http://localhost:4444/api/articles');
            const filteredArticles = response.data.filter(article => article.Topic === formatTitle(genre));
            setArticles(filteredArticles);
        };
        fetchArticles();
    }, [genre]);


    useEffect(() => {
        function compareDatesNewest(a, b) {
            return new Date(b.Published) - new Date(a.Published);
        }

        function compareDatesOldest(a, b) {
            return new Date(a.Published) - new Date(b.Published);
        }

        if (sortOption === "newest") {
            setArticles((prevArticles) => [...prevArticles].sort(compareDatesNewest));
        } else if (sortOption === "oldest") {
            setArticles((prevArticles) => [...prevArticles].sort(compareDatesOldest));
        }
    }, [sortOption]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const filteredArticles = articles.filter((article) => {
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const filter = filterText.toLowerCase();
        return title.includes(filter) || summary.includes(filter);
    });

    // slice the array to get the first 10 articles
    const articlesToDisplay = filteredArticles.slice(0, numDisplayedArticles);

    const handleLoadMore = () => {
        setNumDisplayedArticles(numDisplayedArticles + 20);
    };

    return (
        <div className="row">
            <h2 className="text-center text-dark mt-5">Articles for {formatTitle(genre)}</h2>
            <div className="col-12 d-flex justify-content-center">
                <div className="form-group w-auto pb-3 d-flex justify-content-between">
                    <input
                        type="text"
                        className="form-control"
                        id="filter"
                        name="filter"
                        placeholder="Search"
                        value={filterText}
                        onChange={(e) => {
                            setFilterText(e.target.value);
                        }}
                    />
                    <button
                        type="button"
                        className={`btn w-auto ms-1 btn-outline-danger ${filterText === '' ? 'd-none' : ''}`}
                        onClick={() => setFilterText('')}
                    >
                        X
                    </button>
                    <div className="dropdown ps-2">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {sortOption ? sortOption : 'Sort By'}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><button className="dropdown-item" type="button" value="newest" onClick={handleSortChange}>newest</button></li>
                        <li><button className="dropdown-item" type="button" value="oldest" onClick={handleSortChange}>oldest</button></li>
                    </ul>
                    </div>
                </div>
            </div>

            <ul className="articles-row">
                {articlesToDisplay.map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article}/>
                    </li>
                ))}
            </ul>
            {numDisplayedArticles < filteredArticles.length && (
                <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-outline-primary" onClick={handleLoadMore}>
                        Load More
                    </button>
                    <small className="text-center text-dark d-flex justify-content-center align-items-center ps-3">
                        Showing {numDisplayedArticles} of {filteredArticles.length} articles
                    </small>
                </div>
            )}
        </div>
    )
        ;
};

export default Home;
