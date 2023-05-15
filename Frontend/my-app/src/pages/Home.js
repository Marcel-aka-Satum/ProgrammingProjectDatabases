import React, {useEffect, useState, useContext} from 'react'
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";
import {
    formatTitle,
    formatDate,
    getTimeAgo,
    formatSummary,
    handleClipboard,
    PrintNewspaper,
    handleHideArticle,
    shares,
    extractBaseUrl
} from "../components/Helpers/general";
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';
import {userSession} from '../App'
import {site_domain, request_headers} from "../globals";
import Cookies from 'js-cookie';
import {faker} from '@faker-js/faker';

// function Comments({article}) {
//     const [sortBy, setSortBy] = useState('newest');
//     const [currentPage, setCurrentPage] = useState(1);
//     const commentsPerPage = 5;
//     const generateRandomComments = (count) => {
//         const comments = [];
//
//         for (let i = 0; i < count; i++) {
//             const comment = {
//                 user: faker.internet.userName(),
//                 date: faker.date.past().toISOString(),
//                 message: faker.lorem.sentence(),
//             };
//
//             comments.push(comment);
//         }
//
//         return comments;
//     };
//
//     const comments = generateRandomComments(80);
//
//     // Sort comments based on the selected sorting option
//     const sortedComments = comments.sort((a, b) => {
//         if (sortBy === 'newest') {
//             return new Date(b.date) - new Date(a.date);
//         } else {
//             return new Date(a.date) - new Date(b.date);
//         }
//     });
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };
//     // Paginate comments based on the current page
//     const indexOfLastComment = currentPage * commentsPerPage;
//     const indexOfFirstComment = indexOfLastComment - commentsPerPage;
//     const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);
//
//     const handleSortChange = (event) => {
//         setSortBy(event.target.value);
//         setCurrentPage(1);
//     };
//     const renderPagination = () => {
//         const totalPages = Math.ceil(comments.length / commentsPerPage);
//         const pageRange = 2; // Number of pages to show before and after the current page
//         const pagination = [];
//
//         if (totalPages <= 1) {
//             return null; // No need to render pagination if there's only one page
//         }
//
//         const addPage = (pageNumber) => {
//             pagination.push(
//                 <button
//                     key={pageNumber}
//                     className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
//                     onClick={() => handlePageChange(pageNumber)}
//                 >
//                     {pageNumber}
//                 </button>
//             );
//         };
//
//         // Add "<<" pagination link
//         if (currentPage > 1) {
//             pagination.push(
//                 <button
//                     key="first"
//                     className="page-number"
//                     onClick={() => handlePageChange(1)}
//                 >
//                     <i className="fas fa-angle-double-left"></i>
//                 </button>
//             );
//         }
//
//         // Add pages before the current page
//         for (let i = currentPage - pageRange; i < currentPage; i++) {
//             if (i > 0) {
//                 addPage(i);
//             }
//         }
//
//         // Add the current page
//         addPage(currentPage);
//
//         // Add pages after the current page
//         for (let i = currentPage + 1; i <= currentPage + pageRange; i++) {
//             if (i <= totalPages) {
//                 addPage(i);
//             }
//         }
//
//         // Add ">>" pagination link
//         if (currentPage < totalPages) {
//             pagination.push(
//                 <button
//                     key="last"
//                     className="page-number"
//                     onClick={() => handlePageChange(totalPages)}
//                 >
//                     <i className="fas fa-angle-double-right"></i>
//                 </button>
//             );
//         }
//
//         return (
//             <div className="pagination">
//                 {pagination}
//             </div>
//         );
//     };
//
//     return (
//         <div className="comments">
//             <div className="sorting">
//                 <label htmlFor="sort-select" className="sort-label">
//                     Sort By:
//                 </label>
//                 <select id="sort-select" className="sort-select" value={sortBy} onChange={handleSortChange}>
//                     <option value="newest" className="sort-option">
//                         Newest
//                     </option>
//                     <option value="oldest" className="sort-option">
//                         Oldest
//                     </option>
//                 </select>
//             </div>
//             {currentComments.map((comment, index) => (
//                 <div className="comment" key={index}>
//                     <div className="comment-body">
//                         <div className="comment-body-header">
//                             <div className="comment-user-name">{comment.user}</div>
//                             <div className="comment-date">{getTimeAgo(formatDate(comment.date))}</div>
//                         </div>
//                         <div className="comment-text">
//                             <p>{comment.message}</p>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//             {renderPagination()}
//         </div>
//     );
// }


function ArticleCard({article, onFilterTextChange, logged, uid, favorites, setFavorites}) {
    const [show, setShow] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const text = formatSummary(article.Summary);


    const addFavorite = async (URL) => {
        try {
            const response = await axios.post(`${site_domain}/api/addFavored`, {
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
            const response = await axios.post(`${site_domain}/api/delete_favored`, {
                UID: uid,
                article_url: URL,
                headers: request_headers
            })
            if (response.data.status === 200) {
                SUCCESS(response.data.message)
                console.log(response.data)
                setFavorites(favorites.filter(favorite => favorite !== URL)) // Update the favorites state immediately
            } else {
                ERROR(response.data.message)
            }
        } catch (err) {
            ERROR(err)
        }
    }

    const handleClick = async (URL) => {
        try {
            // console.log('URL clicked:', URL);
            await axios.post(`${site_domain}/api/addhasclicked`, {
                URL: URL,
                Cookie: Cookies.get('user'),
            });
        } catch (err) {
            console.log('Error clicking:', err);
        }
    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const openCommentsModal = () => setShowCommentsModal(true);
    const closeCommentsModal = () => setShowCommentsModal(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    function showImage() {
        if (article.Image.includes('logo')) {
            return (
                <img
                    src={article.Image}
                    onError={(e) => e.target.style.display = 'none'}
                    alt=''
                    className="rounded-top logo"
                    onLoad={handleImageLoad}
                />

            );
        } else {
            return (
                <img
                    src={article.Image}
                    onError={(e) => e.target.style.display = 'none'}
                    alt=''
                    className="img-fluid rounded-top"
                    onLoad={handleImageLoad}
                />
            );
        }
    }

    return (
        <div className="article-card hide-btn-group">
            <div className='boxi'>
                <a
                    href={article.URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => handleClick(article.URL)}
                    onAuxClick={(e) => handleClick(article.URL)}
                    onTouchEnd={(e) => handleClick(article.URL)}
                >
                    {article.Image ? (
                        <>
                            {isLoading && <div className="loading-animation"></div>}
                            {showImage()}
                        </>
                    ) : (
                        <div className="no-image"></div>
                    )}
                </a>

                <div className="bottom-0">
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
                    <div className="container mt-3">
                        <button className='btn btn-outline-primary me-2 ms-1 hide-btn' onClick={handleShow}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>
                        {/*<button*/}
                        {/*    className='btn btn-outline-primary'*/}
                        {/*    data-toggle="tooltip"*/}
                        {/*    data-placement="top"*/}
                        {/*    title="Message"*/}
                        {/*    onClick={openCommentsModal}*/}
                        {/*>*/}
                        {/*    <i className="far fa-comment-dots"></i>*/}
                        {/*    <span className="badge text-custom-dark text-custom-light">0</span>*/}
                        {/*</button>*/}


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
                        {/*<Modal*/}
                        {/*    show={showCommentsModal}*/}
                        {/*    onHide={closeCommentsModal}*/}
                        {/*    backdrop={true}*/}
                        {/*    keyboard={true}*/}
                        {/*>*/}
                        {/*    <Modal.Header closeButton>*/}
                        {/*        <Modal.Title>Comments</Modal.Title>*/}
                        {/*    </Modal.Header>*/}

                        {/*    /!*<Modal.Body>*!/*/}
                        {/*    /!*    <Comments article={article}/>*!/*/}
                        {/*    /!*</Modal.Body>*!/*/}
                        {/*    */}
                        {/*    <Modal.Footer>*/}
                        {/*        <button className='btn btn-danger' onClick={closeCommentsModal}>*/}
                        {/*            Close*/}
                        {/*        </button>*/}
                        {/*    </Modal.Footer>*/}
                        {/*</Modal>*/}


                        {(logged) ?
                            <>

                                {favorites.includes(article.URL) ?
                                    <>
                                        <button
                                            className="btn btn-danger me-2"
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


                        <span className="article-card-date float-end">
                        <i>{formatDate(article.Published)}</i>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

function GenreSection({
                          genre,
                          articles,
                          filterText,
                          onFilterTextChange,
                          logged,
                          uid,
                          favorites,
                          setFavorites,
                          usersession
                      }) {
    function addDashes(str) {
        return str.replace(/\s+/g, '-');
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
                {genre} {logged && usersession.user.isAdmin && usersession.user.debug && (
                `(${filteredArticles.length})`
            )}


                <a href={`genre/${addDashes(genre)}`} rel='noreferrer'>
                    <button className="btn btn-outline-secondary ms-3">Show All</button>
                </a>
            </h2>
            <ul className="articles-row">
                {filteredArticles.slice(0, 3).map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article} onFilterTextChange={onFilterTextChange} logged={logged}
                                     uid={uid} favorites={favorites} setFavorites={setFavorites}/>
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
        const [favorites, setFavorites] = useState([])

        const [filterText, setFilterText] = useState("");
        const [sortOption, setSortOption] = useState("newest");

        let usersession = useContext(userSession);

        useEffect(() => {
            const fetchArticles = async () => {
                const response = await axios.get(`${site_domain}/api/articles`);
                // const limitedArticles = response.data.slice(0, 500);
                if (response.data !== "tuple index out of range") {
                    setArticles(response.data);
                }
            };
            fetchArticles();

        }, []);

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
            function compareDatesNewest(a, b) {
                return new Date(b.Published) - new Date(a.Published);
            }

            function compareDatesOldest(a, b) {
                return new Date(a.Published) - new Date(b.Published);
            }

            function sortArticlesByDate(articles, sortOption) {
                if (sortOption === "newest") {
                    return articles.sort(compareDatesNewest);
                } else if (sortOption === "oldest") {
                    return articles.sort(compareDatesOldest);
                } else {
                    return articles;
                }
            }

            function fetchGenres(sortedArticles) {
                const uniqueGenres = new Set();
                const grouped = {};

                for (const article of sortedArticles) {
                    uniqueGenres.add(article.Topic);

                    if (!grouped[article.Topic]) {
                        grouped[article.Topic] = [];
                    }
                    grouped[article.Topic].push(article);
                }

                // Sort each genre's articles by date
                for (const genre in grouped) {
                    grouped[genre] = sortArticlesByDate(grouped[genre], sortOption);
                }

                // Sort the genres by the date of the latest article in each genre
                const sortedGenres = Array.from(uniqueGenres).sort((a, b) => {
                    const latestA = grouped[a][0].Published;
                    const latestB = grouped[b][0].Published;
                    return new Date(latestB) - new Date(latestA);
                });

                // Reverse the order so that the genres with the latest articles are first
                if (sortOption === "oldest") {
                    sortedGenres.reverse();
                }
                setGenres(sortedGenres);

                setArticlesGenre(grouped);
            }

            if (articles.length > 0) {
                // Sort all articles by date before grouping them by genre
                const sortedArticles = sortArticlesByDate([...articles], sortOption);
                fetchGenres(sortedArticles);
            }
        }, [articles, sortOption]);


        const handleSortChange = (e) => {
            setSortOption(e.target.value);
        };

        const handleFilterTextChange = (newText) => {
            setFilterText(newText);
        };


        return (
            <div className="container-lg pt-5">
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
                    <div className="filter-bar">


                        <div className="dropdown ps-2">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {sortOption ? sortOption : 'newest'}
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
                        <a href="/genre/recommended">
                            <button className="btn btn-outline-secondary d-inline-flex align-items-center">
                                <i className="fa fa-fire me-2" style={{color: "#c01c28"}}> </i> Recommended
                            </button>
                        </a>
                    </div>
                </div>
                <div className="row">
                    {Array.from(genres).map((genre) => (
                        <GenreSection key={genre} genre={genre} articles={articlesGenre[genre]} filterText={filterText}
                                      onFilterTextChange={handleFilterTextChange} logged={usersession.user.isLogged}
                                      uid={usersession.user.uid} favorites={favorites} setFavorites={setFavorites}
                                      usersession={usersession}
                        />
                    ))}
                </div>
            </div>

        );
    }
;

export default Home;
