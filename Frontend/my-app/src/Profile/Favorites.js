import React, {useState, useEffect, useContext} from 'react';
import '../pages/Home.css'
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";
import {formatDate, formatSummary, formatTitle, PrintNewspaper, extractBaseUrl} from "../components/Helpers/general";
import 'bootstrap/dist/css/bootstrap.min.css'
import {userSession} from "../App";


function ArticleCard({article, removeFavorite, filterText}) {
    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const text = formatSummary(article.Summary);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="article-card hide-btn-group">
            <div className='boxi'>
                <a href={article.URL} target="_blank" rel="noreferrer">
                    {article.Image ? (
                        <>
                            {isLoading && <div className="loading-animation"></div>}
                            <img
                                src={article.Image}
                                onError={(e) => e.target.style.display = 'none'}
                                alt=''
                                className="img-fluid rounded-top"
                                onLoad={handleImageLoad}
                            />
                        </>
                    ) : (
                        <div className="no-image"></div>
                    )}
                </a>
                <div className="bottom-0">
                    <button
                        className='background-newspaper text-decoration-none'
                        onClick={() => {
                            filterText(PrintNewspaper({url: article.URL}))
                        }
                        }
                    >
                        <PrintNewspaper url={article.URL}/>
                    </button>
                </div>
            </div>
            <div className="article-card-body pe-3 ps-3 pb-2">
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content" dangerouslySetInnerHTML={{__html: text[0]}}/>

                <i className={'float-end pb-2'}>{formatDate(article.Published)}</i>
                <button className="btn btn-outline-danger w-100" data-toggle="tooltip"
                        data-placement="top"
                        title="Remove from favorites"
                        onClick={removeFavorite(article.URL)}
                >
                    Remove from favorites
                </button>
            </div>
        </div>
    )
}


export default function Account() {
    const [favorites, setFavorites] = useState([])
    const [articles, setArticles] = useState([])

    const [filterText, setFilterText] = useState("");
    const [sortOption, setSortOption] = useState("newest");

    let usersession = useContext(userSession);

    useEffect(() => {
        async function fetchFavorites() {
            const r_favorites = await fetch('http://localhost:4444/api/favorites')
            const data = await r_favorites.json();
            const data_user = data.favorites[usersession.user.uid]
            if (data_user) {
                setFavorites(data_user)
            }
        }

        fetchFavorites();
    }, []);


    useEffect(() => {
            async function fetchArticles() {
                //     loop over favorites and do a fetch for each article
                for (let i = 0; i < favorites.length; i++) {
                    let a_url = favorites[i]
                    const r_article = await fetch('http://localhost:4444/api/get_article', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({article_url: a_url}),
                    });
                    const data = await r_article.json();
                    if (data.article) {
                        // if article url not in there add it
                        const isArticleInArray = articles.some((article) => article.url === data.article.url);

                        if (!isArticleInArray) {
                            // If the article is not in the array, add it
                            setArticles((articles) => [...articles, data.article[1]]);
                        }
                    }
                }
            }

            fetchArticles();
        }
        , [favorites]);

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

    const handleFilterTextChange = (newText) => {
        setFilterText(newText);
    };


    const filteredArticles = articles.filter((article) => {
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const url = extractBaseUrl(article.URL);
        const filter = filterText.toLowerCase();
        return title.includes(filter) || summary.includes(filter) || url.includes(filter);
    });
    const removeFavorite = (url) => async () => {
        const response = await fetch('http://localhost:4444/api/delete_favored', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({article_url: url, UID: usersession.user.uid}),
        });
        const data = await response.json();
        if (data.status === 200) {
            SUCCESS('Successfully removed from favorites')
            setFavorites(favorites.filter((item) => item !== url))
            setArticles(articles.filter((item) => item.URL !== url))
        } else {
            ERROR('Failed to remove from favorites')
        }
    }


    const articlesToDisplay = filteredArticles
        .sort((a, b) => {
            const dateA = new Date(a.Published);
            const dateB = new Date(b.Published);
            if (sortOption === "oldest") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        })


    return (
        <div className="container-lg pt-5">
            <h1>
                My Favorites
                <>
                    <i className="fas fa-heart ps-3" style={{color: 'red'}}/>
                    <span className="ps-2">{favorites.length}</span>
                </>
            </h1>

            <div className="form-group w-50 pb-3 d-flex justify-content-between">
                <input
                    type="text"
                    className="form-control"
                    id="filter"
                    name="filter"
                    placeholder="Filter by title, summary or source"
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
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {sortOption ? sortOption : 'Sort By'}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li>
                            <button className="dropdown-item" type="button" value="newest"
                                    onClick={handleSortChange}>newest
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" type="button" value="oldest"
                                    onClick={handleSortChange}>oldest
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <hr/>
            <div className="row">
                <ul className="articles-row">

                    {articlesToDisplay.map((article) => (
                        <li key={article.URL} className="p-3">
                            <ArticleCard article={article} removeFavorite={removeFavorite}
                                         filterText={handleFilterTextChange}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
