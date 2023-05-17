import React, {useContext, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    extractBaseUrl,
    formatDate,
    formatSummary,
    formatTitle,
    handleClipboard,
    PrintNewspaper,
    shares
} from "../components/Helpers/general"

import {CopyToClipboard} from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';
import {userSession} from '../App'
import {ERROR, SUCCESS} from "../components/Helpers/custom_alert";
import {request_headers, site_domain} from "../globals";
import Cookies from "js-cookie";

function ArticleCard({article, onFilterTextChange, logged, uid, favorites, setFavorites, related}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const text = formatSummary(article.Summary);
     const [showSimilarModal, setShowSimilarModal] = useState(false);

    const addFavorite = async (URL) => {
        try {
            const response = await axios.post(`${site_domain}/api/favorites`, {
                UID: uid,
                article_url: URL,
                headers: request_headers
            })
            if (response.data.status === 200) {
                SUCCESS(response.data.message)
                console.log(response.data)
                setFavorites([...favorites, URL]) // Update the favorites state immediately
            } else {
                console.log(response.data.message)
                ERROR(response.data.message)
            }
        } catch (err) {
            console.log('response:', err)
            ERROR(err)
        }
    }

    const removeFavorite = async (URL) => {
        try {
            const response = await axios.post(`${site_domain}/api/favorites`, {
                UID: uid,
                article_url: URL,
                headers: request_headers
            })
            if (response.data.status === 200) {
                SUCCESS(response.data.message)
                setFavorites(favorites.filter(favorite => favorite !== URL)) // Update the favorites state immediately
            } else {
                ERROR(response.data.message)
            }
        } catch (err) {
            ERROR(err)
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseSimilarModal = () => setShowSimilarModal(false);
    const handleShowSimilarModal = () => setShowSimilarModal(true);


    const handleImageLoad = () => {
        // If the article image is already loaded or the loading animation has already been removed, do nothing
        if (!isLoading || article.Image === null) {
            return;
        }

        let timeoutId = null;

        // Set a timeout of 5 seconds to remove the loading animation and display a placeholder image
        timeoutId = setTimeout(() => {
            setIsLoading(false);
            article.Image = null; // Set the article image to null to trigger the placeholder image
            clearTimeout(timeoutId);
        }, 5000);

        // If the image finishes loading before the timeout, clear the timeout
        const img = new Image();
        img.onload = () => {
            clearTimeout(timeoutId);
            setIsLoading(false);
        };
        img.src = article.Image;
    };

    const handleClick = async (URL) => {
        console.log('URL clicked:', URL);
        try {
            await axios.post(`${site_domain}/api/clicked`, {
                URL: URL,
                Cookie: Cookies.get('user'),
            });
        } catch (err) {
            console.log('Error clicking:', err);
        }
    };

    return (
        <div className="article-card hide-btn-group">
            <a
                href={article.URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleClick(article.URL)}
                onAuxClick={() => handleClick(article.URL)}
                onTouchEnd={() => handleClick(article.URL)}
            >
                <div className='boxi'>
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
                </div>
            </a>

            <div className="bottom-0" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <button
                    className='background-newspaper text-decoration-none'
                    onClick={() => {
                        onFilterTextChange(PrintNewspaper({url: article.URL}));
                    }}
                >
                    <PrintNewspaper url={article.URL}/>
                </button>
            </div>

            <div className="article-card-body pe-3 ps-3">
                <a
                    href={article.URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleClick(article.URL)}
                    onAuxClick={() => handleClick(article.URL)}
                    onTouchEnd={() => handleClick(article.URL)}
                >
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content"
                     dangerouslySetInnerHTML={{__html: text[0]}}/>

                <div className="article-card-footer pb-3 mt-3">
                    <div className="container mt-3 btn-group">
                        <button className='btn btn-outline-primary' onClick={handleShow} data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>

                        {/*button that says 'Similar'*/}
                        {related.length > 0 ? (
                            <>
                            <button className='btn btn-outline-primary' onClick={handleShowSimilarModal}
                                data-toggle="tooltip" data-placement="top" title="Similar">
                            <i className="fas fa-search"></i>
                            <span className="text-custom-dark">10</span>
                        </button>
                        <Modal show={showSimilarModal} onHide={handleCloseSimilarModal} backdrop={true} keyboard={true}>
                            <Modal.Header closeButton>
                                <Modal.Title>Similar Articles</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{
                                margin: '20px', padding: '20px', display: 'flex',
                                flexDirection: 'column', alignItems: 'center',
                            }}>
                                <div style={{height: '500px', overflowY: 'scroll'}}>
                                    {related.map(cluster => {
                                        return (<div className="card" style={{marginBottom: '10px'}}>
                                        <img
                                            src={cluster.Image}
                                            onError={(e) => (e.target.style.display = 'none')}
                                            alt=''
                                            className="card-img-top"
                                            style={{display: cluster.Image ? 'block' : 'none'}}
                                        />
                                        <div className="card-body">
                                            <p>{<PrintNewspaper url={cluster.URL}/>}</p>
                                            <a
                                                href={cluster.URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() => handleClick(cluster.URL)}
                                                onAuxClick={() => handleClick(cluster.URL)}
                                                onTouchEnd={() => handleClick(cluster.URL)}
                                                className="text-decoration-none text-dark"
                                            >
                                                <h5 className="card-title">{formatTitle(cluster.Title)}</h5>
                                            </a>
                                        </div>
                                    </div>)
                                    })}
                                </div>
                            </Modal.Body>
                        </Modal>
                            </>
                        ) : <></>}


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
                                                className="btn"
                                                style={{position: "absolute", right: "0"}}
                                                title="Copy link"
                                                onClick={handleClipboard}
                                            >
                                                <i className="far fa-clipboard" aria-hidden="true"></i>
                                            </button>
                                        </CopyToClipboard>
                                    </div>

                                    {shares(article)}

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn btn-danger' onClick={handleClose}>
                                    Close
                                </button>
                            </Modal.Footer>
                        </Modal>

                        {(logged) ?
                            <>

                                {favorites.includes(article.URL) ?
                                    <>
                                        <button
                                            className="btn btn-danger"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Remove from favorites"
                                            onClick={
                                                () => removeFavorite(article.URL)
                                            }
                                        >
                                            <i className="fa fa-heart"></i>
                                        </button>

                                    </>
                                    :
                                    <>
                                        <button
                                            className="btn btn-outline-danger me-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Add to favorites"
                                            onClick={
                                                () => addFavorite(article.URL)
                                            }
                                        >
                                            <i className="far fa-heart"></i>
                                        </button>
                                    </>
                                }
                            </>
                            : <></>
                        }


                    </div>
                    <span className="article-card-date float-end pb-2 pt-2">
                            <i>{formatDate(article.Published)}</i>
                        </span>
                </div>
            </div>
        </div>
    )
        ;
}

const Home = () => {
    const genre = useLocation().pathname.split('/')[2].replace(/-/g, " ");
    const [articles, setArticles] = useState([])
    const [numDisplayedArticles, setNumDisplayedArticles] = useState(20);
    const [favorites, setFavorites] = useState([])
    const [clustersGenre, setClustersGenre] = useState([])

    const [filterText, setFilterText] = useState('');
    const [sortOption, setSortOption] = useState("newest");
    const [disableSort, setDisableSort] = useState(false);
    let usersession = useContext(userSession);

    useEffect(() => {
        if (genre === 'recommended') {
            ////TODO: fix this
            const fetchArticles = async () => {
                const response = await fetch(`${site_domain}/api/articles/recommended`, {
                    method: 'POST',
                    headers: request_headers,
                    body: JSON.stringify({
                        Cookie: Cookies.get('user')
                    })
                });
                const data = await response.json();
                setDisableSort(true);
                setArticles(data.articles);
            };

            fetchArticles();
        } else {
            const fetchClustersGenre = async () => {
                await axios.post(`${site_domain}/api/clustersGenre`, {
                    genre: genre,
                    headers: request_headers
                }).then(response => {
                  const ClustersGenre = response.data['clusters'][1].map(cluster => {
                    return cluster.sort((a, b) => new Date(b[0][0].Published) - new Date(a[0][0].Published));
                  });
                  const sorted = ClustersGenre.sort((a, b) => {
                    return new Date(b[0][0].Published) - new Date(a[0][0].Published);
                    });

                  setClustersGenre(sorted);
                });
            };
            fetchClustersGenre();
        }
    }, [genre]);


    useEffect(() => {
        async function fetchFavorites() {
            const r_favorites = await fetch(`${site_domain}/api/favorites`)
            const data = await r_favorites.json();
            const data_user = data.favorites[usersession.user.uid]
            if (data_user) {
                setFavorites(data_user)
            }
        }

        fetchFavorites();
    }, []);

    useEffect(() => {
        if (sortOption === "newest") {

                  const ClustersGenre = clustersGenre.map(cluster => {

                    return cluster.sort((a, b) => new Date(b[0][0].Published) - new Date(a[0][0].Published));
                  });
                  const sorted = ClustersGenre.sort((a, b) => {
                    return new Date(b[0][0].Published) - new Date(a[0][0].Published);
                    });
                  setClustersGenre(sorted);

        } else if (sortOption === "oldest") {
            const ClustersGenre = clustersGenre.map(cluster => {
                    return cluster.sort((a, b) => new Date(a[0][0].Published) - new Date(b[0][0].Published));
                  });
                  const sorted = ClustersGenre.sort((a, b) => {
                    return new Date(a[0][0].Published) - new Date(b[0][0].Published);
                    });
                  setClustersGenre(sorted);
        }
    }, [sortOption]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    const handleFilterTextChange = (newText) => {
        setFilterText(newText);
    };

    const filteredArticles = clustersGenre.map((articleList) => {
        return articleList[0].filter((article) => {
            const title = article.Title.toLowerCase();
            const summary = article.Summary.toLowerCase();
            const url = extractBaseUrl(article.URL);
            const filter = filterText.toLowerCase();
            return title.includes(filter) || summary.includes(filter) || url.includes(filter);
        });
    });

    const filteredArray = filteredArticles.filter((subArray) => subArray.length > 0);

    let articlesToDisplay
    if (sortOption === "newest") {

        const ClustersGenre = filteredArray.map(cluster => {
        return cluster.sort((a, b) =>
            new Date(b.Published) - new Date(a.Published));
        });
        articlesToDisplay = ClustersGenre.sort((a, b) => {
        return new Date(b.Published) - new Date(a.Published);
        });

    } else if (sortOption === "oldest") {
        const ClustersGenre = filteredArray.map(cluster => {
                return cluster.sort((a, b) => new Date(a.Published) - new Date(b.Published));
              });
        articlesToDisplay = ClustersGenre.sort((a, b) => {
        return new Date(a.Published) - new Date(b.Published);
        });
    }

    const slicedArticles = articlesToDisplay.slice(0, numDisplayedArticles);


    const handleLoadMore = () => {
        setNumDisplayedArticles(numDisplayedArticles + 20);
    };

    return (
        <div className="row">
            <h2 className="text-center text-dark mt-5">{formatTitle(genre)}</h2>
            <div className="col-12 d-flex justify-content-center">
                <div className="form-group w-auto pb-3 d-flex justify-content-between">
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
                    {!disableSort ? (
                        <div className="dropdown ps-2">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
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
                    ) : null}

                </div>
            </div>

            <ul className="articles-row">
               {slicedArticles.map((articles) => (
                    articles.length > 0 ? (
                    <li key={articles[0].URL} className="p-3">
                        <ArticleCard article={articles[0]} onFilterTextChange={handleFilterTextChange}
                                     logged={usersession.user.isLogged} uid={usersession.user.uid} favorites={favorites}
                                     setFavorites={setFavorites} related={articles.length > 0 ? (articles.slice(1)) : []}/>
                    </li>
                    ) : <></>
                ))}
            </ul>
            {numDisplayedArticles < filteredArray.length && (
                <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-outline-primary" onClick={handleLoadMore}>
                        Load More
                    </button>
                    <small className="text-center text-dark d-flex justify-content-center align-items-center ps-3">
                        Showing {numDisplayedArticles} of {filteredArray.length} articles
                    </small>
                </div>
            )}
        </div>
    )
        ;
};

export default Home;

