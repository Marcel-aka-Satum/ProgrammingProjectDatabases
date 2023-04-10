import React, {useEffect, useState} from 'react'
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

            <img src={article.Image} alt='' className="img-fluid rounded pb-3"/>
            <div className="article-card-body pe-3 ps-3">
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <h4 className="article-card-title">{formatTitle(article.Title)}</h4>
                </a>

                <div className="article-card-content"
                     dangerouslySetInnerHTML={{__html: formatSummary(article.Summary)[0]}}
                />

                <div className="article-card-footer pb-3 float-end">
                    <button id="addToFav">
                        Add to favorite
                    </button>
                    <span className="article-card-date">
                        <i>{formatDate(article.Published)}</i>
                    </span>
                </div>

            </div>
        </div>
    );
}

function GenreSection({genre, articles, filterText}) {
    function addDashes(str) {
        return str.replace(/\s+/g, '-');
    }

    const filteredArticles = articles.filter((article) => {
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const filter = filterText.toLowerCase();
        return title.includes(filter) || summary.includes(filter);
    });

    if (filteredArticles.length === 0) {
        return null; // return null to skip rendering this component
    }

    return (
        <div className="genre-section">
            <h2>
                {genre}{' '}
                <a href={`genre/${addDashes(genre)}`} target='_blank' rel='noreferrer'>
                    <button className="btn btn-outline-secondary">Show All</button>
                </a>
            </h2>
            <ul className="articles-row">
                {filteredArticles.slice(0, 3).map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Home = () => {
        const [articles, setArticles] = useState([])
        const [genres, setGenres] = useState(new Set())
        const [articlesGenre, setArticlesGenre] = useState([])

        const [filterText, setFilterText] = useState("");
        const [sortOption, setSortOption] = useState("Sort By");


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

        return (
            <div className="container-lg pt-5">
                <div className="form-group w-50 pb-3 d-flex justify-content-between">
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

                <div className="row">
                    {Array.from(genres).map((genre) => (
                        <GenreSection key={genre} genre={genre} articles={articlesGenre[genre]} filterText={filterText}/>
                    ))}
                </div>
            </div>
        );
    }
;

export default Home;

