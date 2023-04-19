import React from 'react'
import {useState, useEffect} from 'react';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from "../Helpers/custom_alert";
import "./admin.css"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [numDisplayedArticles, setNumDisplayedArticles] = useState(20);
    const [newArticle, setNewArticle] = useState({
        title: "",
        description: "",
        image: ""
    });
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        async function fetchData() {
            const r_articles = await fetch('http://localhost:4444/api/articles')
            const data = await r_articles.json();
            if (data) {
                SUCCESS("Articles loaded successfully!");
                // only get the first 20 articles
                // data.articles = data.articles.slice(0, 20);
                setArticles(data);
            } else {
                UNKNOWN_ERROR('An error occurred while loading articles!');
            }

        }

        fetchData();
    }, []);

    const addArticle = () => {
        if (!newArticle.Title || !newArticle.Summary || !newArticle.Image) {
            ERROR("Please fill out all fields!");
            return;
        }
        setArticles((prevState) => [
            ...prevState,
            {
                Title: newArticle.Title,
                Description: newArticle.Summary,
                Image: newArticle.Image

            }
        ]);
        SUCCESS("Article added successfully!");
        setNewArticle({
            title: "",
            description: "",
            image: ""
        });
    }


    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredArticles = articles.filter(
        (article) =>
            article.Title.toLowerCase().includes(filterText.toLowerCase()) ||
            article.Summary.toLowerCase().includes(filterText.toLowerCase())
    );

    function urlToSelector(url) {
        const base64Url = btoa(url);
        const sanitizedUrl = base64Url.replace(/=/g, ''); // remove padding characters
        return sanitizedUrl;
    }

    function getHostName(url) {
        var parser = document.createElement('a');
        parser.href = url;
        var hostname = parser.hostname;
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }
        return hostname;
    }

    // slice the array to get the first 10 articles
    const articlesToDisplay = filteredArticles.slice(0, numDisplayedArticles);

    const handleLoadMore = () => {
        setNumDisplayedArticles(numDisplayedArticles + 20);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center text-dark mt-5">Article Management System</h2>
                    <div className="form-group w-25 mb-2">
                        <label htmlFor="filter">Filter by Title or Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="filter"
                            name="filter"
                            placeholder="Search"
                            value={filterText}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="row">
                        {articlesToDisplay.map((article) => (
                            <div className="col-md-4 mb-4" key={article.URL}>
                                <div className="card">
                                    <img
                                        src={article.Image}
                                        className="card-img-top"
                                        alt="Article Image"
                                        style={{
                                            height: "300px",
                                            objectFit: "cover",
                                            objectPosition: "center center"
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title"><a href={article.URL}>{article.Title}</a></h5>
                                        <div
                                            className="card-text"
                                            style={{
                                                maxHeight: '100px',
                                                minHeight: '100px',
                                                overflow: 'hidden'
                                            }}
                                            dangerouslySetInnerHTML={{__html: article.Summary}}
                                        ></div>
                                        <span className="badge bg-primary">{getHostName(article.URL)}</span>

                                        <div className="btn-group float-end" role="group">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#readArticleModal-${urlToSelector(article.URL)}`}
                                            >
                                                Read More
                                            </button>
                                        </div>
                                        <div className="modal fade"
                                             id={`readArticleModal-${urlToSelector(article.URL)}`}
                                             tabIndex="-1"
                                             aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Article</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h5>{article.Title}</h5>
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: article.Summary}}
                                                        ></div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
    );
}