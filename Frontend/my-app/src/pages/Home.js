import React, {useEffect, useState, useContext} from 'react'
import {SUCCESS} from "../components/Helpers/custom_alert";
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    FacebookShareButton,
    FacebookShareCount,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    RedditShareButton,
    RedditShareCount,
    RedditIcon,
    TumblrShareButton,
    TumblrShareCount,
    TumblrIcon,
    TwitterShareButton,
    TwitterIcon

} from "react-share";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';

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

function formatSummary(text, limit = 200) {
    if (text.length <= limit) {
        return [text, false];
    } else {
        const truncatedText = text.slice(0, limit);
        return [truncatedText.trim() + '...', true];
    }
}

function ArticleCard({article, onFilterTextChange}) {
    const handleAddToFavorites = (event) => {
        const button = event.currentTarget;

        const likeBtn = "fa fa-heart"
        const dislikeBtn = "far fa-heart"

        const whenLiked = 'btn-danger';
        const isToggled = button.classList.contains(whenLiked);

        if (isToggled) {
            button.classList.add('btn-outline-danger')
            button.classList.remove(whenLiked);
            button.innerHTML = `<i class="${dislikeBtn}"></i>`;
            button.setAttribute('title', 'Add to favorites');
        } else {
            button.classList.remove('btn-outline-danger');
            button.classList.add(whenLiked);
            button.innerHTML = `<i class="${likeBtn}"></i>`;
            button.setAttribute('title', 'Remove from favorites');
        }
    };

    const handleHideArticle = () => {
        SUCCESS('Not implemented yet.');
    };

    const handleClipboard = () => {
        SUCCESS('Link is successfully copied to your clipboard');
    };


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const text = formatSummary(article.Summary);

    function PrintNewspaper(url) {
        const URL = url.url;

        const matches = URL.match(/^https?:\/\/(www\.)?([^/?#]+)/);

        const hostname = matches[2];

        return (hostname.startsWith("www.") ? hostname.substring(4) : hostname)
    }

    return (
        <div className="article-card hide-btn-group">
            <div className='boxi'>
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <img
                        src={article.Image}
                        onError={(e) => e.target.style.display = 'none'}
                        alt=''
                        className="img-fluid rounded-top"
                        style={{display: article.Image ? 'block' : 'none'}}
                    />
                </a>
                <div class="bottom-0">
                    <button
                        className='background-newspaper text-decoration-none'
                        onClick={() => {
                            onFilterTextChange(PrintNewspaper({url: article.URL}))
                        }
                        }
                    >
                        <PrintNewspaper url={article.URL}/>
                    </button>
                </div>
            </div>
            <div className="article-card-body pe-3 ps-3">
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content"
                     dangerouslySetInnerHTML={{__html: text[0]}}/>

                <div className="article-card-footer pb-3 mt-3">

                    <div class="container mt-3">

                        <button className='btn btn-outline-primary me-2 ms-2 hide-btn' onClick={handleShow}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop={true}
                            keyboard={true}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Share this article!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{
                                margin: '20px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div className="card">
                                    <img
                                        src={article.Image}
                                        onError={(e) => e.target.style.display = 'none'}
                                        alt=''
                                        className="card-img-top"
                                        style={{display: article.Image ? 'block' : 'none'}}
                                    />
                                    <div className="card-body">
                                        <p>{<PrintNewspaper url={article.URL}/>}</p>
                                        <h5 className="card-title">{article.Title}</h5>
                                    </div>
                                </div>
                                <div className="mt-3">

                                    <div
                                        className="d-flex justify-content-between align-items-center bg-light p-3 rounded"
                                        style={{position: "relative"}}>
                                        <div className="me-auto" style={{paddingRight: "40px"}}>
                                            {article.URL}
                                        </div>
                                        <CopyToClipboard text={article.URL}>
                                            <button
                                                className="btn "
                                                style={{position: "absolute", right: "0"}}
                                                title="Copy link"
                                                onClick={handleClipboard}
                                            >
                                                <i class="far fa-clipboard" aria-hidden="true"></i>
                                            </button>
                                        </CopyToClipboard>
                                    </div>

                                    <div className="mt-3" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <FacebookShareButton url={article.URL} hashtag='#Newsaggregator'
                                                             className="mr-3">
                                            <FacebookIcon size={70} round={true}/>
                                            <FacebookShareCount url={article.URL}>
                                                {count => <div className="share-count">{count}</div>}
                                            </FacebookShareCount>
                                        </FacebookShareButton>
                                        <WhatsappShareButton url={article.URL} className="mr-3">
                                            <WhatsappIcon size={70} round={true}/>
                                        </WhatsappShareButton>
                                        <TwitterShareButton
                                            url={article.URL}
                                            title="Look which article I found at Newsaggregator"
                                            hashtags={['Newsaggregator']}
                                        >
                                            <TwitterIcon size={70} round/>
                                        </TwitterShareButton>
                                        <RedditShareButton url={article.URL}
                                                           title="Look which article I found at Newsaggregator"
                                                           className="mr-3">
                                            <RedditIcon size={70} round={true}/>
                                            <RedditShareCount url={article.URL}>
                                                {count => <div className="share-count">{count}</div>}
                                            </RedditShareCount>
                                        </RedditShareButton>
                                        <TumblrShareButton url={article.URL}
                                                           title="Look which article I found at Newsaggregator"
                                                           className="mr-3">
                                            <TumblrIcon size={70} round={true} style={{marginTop: '18px'}}/>
                                            <TumblrShareCount url={article.URL}>
                                                {count => <div className="share-count">{count}</div>}
                                            </TumblrShareCount>
                                        </TumblrShareButton>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn btn-danger' onClick={handleClose}>
                                    Close
                                </button>
                            </Modal.Footer>
                        </Modal>

                         <button
                            className="btn btn-outline-warning me-2 hide-btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="I don't like this"
                            onClick={handleHideArticle}
                        >
                            <i className="far fa-thumbs-down"></i>
                        </button>

                        <button
                            className="btn btn-outline-danger me-2 hide-btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Add to favorites"
                            onClick={handleAddToFavorites}
                        >
                            <i className="far fa-heart"></i>
                        </button>
                       
                        <span className="article-card-date float-end p-2 pb-4">
                        <i>{formatDate(article.Published)}</i>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

function GenreSection({genre, articles, filterText, onFilterTextChange}) {
    function addDashes(str) {
        return str.replace(/\s+/g, '-');
    }

    function extractBaseUrl(url) {
        const matches = url.match(/^https?:\/\/(www\.)?([^/?#]+)/);

        const hostname = matches[2];

        return (hostname.startsWith("www.") ? hostname.substring(4) : hostname)
    }

    const filteredArticles = articles.filter((article) => {
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const url = extractBaseUrl(article.URL);
        const filter = filterText.toLowerCase();
        return title.includes(filter) || summary.includes(filter) || url.includes(filter);
    });

    if (filteredArticles.length === 0) {
        return null; // return null to skip rendering this component
    }

    return (
        <div className="genre-section">
            <h2>
                {genre}{' '}
                <a href={`genre/${addDashes(genre)}`} rel='noreferrer'>
                    <button className="btn btn-outline-secondary">Show All</button>
                </a>
            </h2>
            <ul className="articles-row">
                {filteredArticles.slice(0, 3).map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article} onFilterTextChange={onFilterTextChange}/>
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

        const handleFilterTextChange = (newText) => {
            setFilterText(newText);
        };


        return (
            <div className="container-lg pt-5">
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

                <div className="row">
                    {Array.from(genres).map((genre) => (
                        <GenreSection key={genre} genre={genre} articles={articlesGenre[genre]} filterText={filterText}
                                      onFilterTextChange={handleFilterTextChange}/>
                    ))}
                </div>
            </div>
        );
    }
;

export default Home;

