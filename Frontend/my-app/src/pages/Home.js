import React, {useEffect, useState, useContext} from 'react'
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";
import {
    formatTitle,
    formatDate,
    formatSummary,
    handleClipboard,
    PrintNewspaper,
    shares,
    extractBaseUrl, getTimeAgo
} from "../components/Helpers/general";
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';
import {userSession} from '../App'
import {site_domain, request_headers} from "../globals";
import Cookies from 'js-cookie';
import {Quotes} from '../Quotes';
import {Multiselect} from "multiselect-react-dropdown";

function ArticleCard({article, onFilterTextChange, logged, uid, favorites, setFavorites, related, usersession}) {
    const [show, setShow] = useState(false);
    const [showSimilarModal, setShowSimilarModal] = useState(false);
    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const text = formatSummary(article.Summary);

    const addFavorite = async (URL) => {
        console.log('ADD:', URL)
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
        console.log('REMOVE:', URL);
        try {
            const response = await fetch(`${site_domain}/api/favorites`, {
                method: 'DELETE',
                headers: request_headers,
                body: JSON.stringify({
                    UID: uid,
                    article_url: URL
                })
            });
            const responseData = await response.json();
            if (response.ok) {
                SUCCESS(responseData.message);
                console.log(responseData);
                setFavorites(favorites.filter(favorite => favorite !== URL));
            } else {
                ERROR(responseData.message);
            }
        } catch (err) {
            ERROR(err);
        }
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


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseSimilarModal = () => setShowSimilarModal(false);
    const handleShowSimilarModal = () => setShowSimilarModal(true);

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

    const stripTags = (html) => {
        // Create a temporary element
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Get the plain text without HTML tags
        const plainText = tempElement.textContent || tempElement.innerText;

        return plainText;
    };

    const plainText = stripTags(text[0]);

    return (
        <div className="article-card hide-btn-group">
            {/*{logged && usersession.user.isAdmin && usersession.user.debug && (*/}
            {/*    `(${filteredArray.length})`*/}
            {/*)}*/}
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
                            {showImage()}
                            {logged && usersession.user.isAdmin && usersession.user.debug && (
                                <div className="top-left badge rounded-1 bg-dark">{article.Clicked}</div>
                            )}
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
                <a href={article.URL} target="_blank" rel="noreferrer"
                   onClick={() => handleClick(article.URL)}
                   onAuxClick={() => handleClick(article.URL)}
                   onTouchEnd={() => handleClick(article.URL)}>
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content" dangerouslySetInnerHTML={{__html: plainText}}/>

                <div className="article-card-footer pb-3 mt-3">
                    <div className="container mt-3 btn-group">
                        <button className='btn btn-outline-primary' onClick={handleShow} data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>

                        {related.length > 0 ? (
                            <>
                                <button className='btn btn-outline-primary' onClick={handleShowSimilarModal}
                                        data-toggle="tooltip" data-placement="top" title="Similar">
                                    <i className="fas fa-search"></i>
                                    <span className="text-custom-dark ps-2">{related.length}</span>
                                </button>
                                <Modal show={showSimilarModal} onHide={handleCloseSimilarModal} backdrop={true}
                                       keyboard={true}>
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
                            <i>{getTimeAgo(article.Published)}</i>
                    </span>
                </div>
            </div>
        </div>
    );
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

    //console.log(genre)
    //console.log(articles)


    if (articles.length === 0) {
        //console.log("hello")
        return null;
    }

    const filteredArticles = articles.map((Articles) => {

        return Articles.filter((article) => {
            const title = article.Title.toLowerCase();
            const summary = article.Summary.toLowerCase();
            const url = extractBaseUrl(article.URL);
            const filter = filterText.toLowerCase();

            return title.includes(filter) || summary.includes(filter) || url.includes(filter);
        });
    })

    const filteredArray = filteredArticles.filter((subArray) => subArray.length > 0);

    if (filteredArray.length === 0) {
        //console.log("hello")
        return null; // return null to skip rendering this component
    }

    return (
        <div className="genre-section">
            <h2>
                {genre} {logged && usersession.user.isAdmin && usersession.user.debug && (
                `(${filteredArray.length})`
            )}
                <a href={`genre/${addDashes(genre)}`} rel='noreferrer'>
                    <button className="btn btn-outline-secondary ms-3">Show All</button>
                </a>
            </h2>

            <ul className="articles-row">
                {filteredArray.slice(0, 3).map((articles) => (
                    <li className="p-3">
                        <ArticleCard key={articles[0].URL} article={articles[0]} onFilterTextChange={onFilterTextChange}
                                     logged={logged}
                                     uid={uid} favorites={favorites} setFavorites={setFavorites}
                                     related={articles.length > 0 ? (articles.slice(1)) : []}
                                     usersession={usersession}/>
                    </li>
                ))}
            </ul>
        </div>);
}

const Home = () => {
        const [favorites, setFavorites] = useState([])
        const [clusters, setClusters] = useState([])

        const [filterText, setFilterText] = useState("");
        const [sortOption, setSortOption] = useState("newest");
        const [languageClusters, setLanguageClusters] = useState([]);
        const options = [
            {name: "Nederlands", id: 1},
            {name: "English", id: 2},
            {name: "Español", id: 3},
            {name: "Deutsch", id: 4},
            {name: "Français", id: 5}
        ];

        const [selectedOptions, setSelectedOptions] = useState([]);
        const [removedOptions, setRemovedOptions] = useState([]);
        const onSelectOptions = (selectedList, selectedItem) => {
            setSelectedOptions([...selectedOptions, selectedItem]);
            //console.log("hello")
            filterLanguages(selectedList)
            //console.log(languageClusters)
        };
        const onRemoveOptions = (selectedList, removedItem) => {
            const updatedSelectedOptions = selectedOptions.filter(
                (option) => option.id !== removedItem.id
            );
            setSelectedOptions(updatedSelectedOptions);
            setRemovedOptions([...removedOptions, removedItem]);
            filterLanguages(updatedSelectedOptions)
        };

        let usersession = useContext(userSession);

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

        function sortNewestCluster(topics) {
            const sortedTopics = topics.map(clusters => {

                const sortedClustersGenre = clusters[1].map(cluster => {
                    //console.log(cluster['Cluster'])
                    return cluster['Cluster'].sort((a, b) => new Date(b.Published) - new Date(a.Published));
                });

                const sorted = sortedClustersGenre.sort((a, b) => {
                    return new Date(b[0].Published) - new Date(a[0].Published);
                });

                return [clusters[0], sorted]
            });
            return sortedTopics.sort((a, b) => {
                return new Date(b[1][0][0].Published) - new Date(a[1][0][0].Published)
            })
        }

        function sortNewestLanguage(topics) {
            console.log(topics)
            const sortedTopics = topics.map(clusters => {

                const sortedClustersGenre = clusters[1].map(cluster => {
                    return cluster.sort((a, b) => new Date(b.Published) - new Date(a.Published));
                });

                const sorted = sortedClustersGenre.sort((a, b) => {
                    return new Date(b[0].Published) - new Date(a[0].Published);
                });

                return [clusters[0], sorted]
            });
            //console.log(sortedTopics)
            return sortedTopics.sort((a, b) => {
                console.log(a)
                //console.log(a)
                return new Date(b[1][0][0].Published) - new Date(a[1][0][0].Published)
            })
        }

        function sortPopularCluster(topics) {
            const sortedTopics = topics.map(clusters => {
                const sortedClustersGenre = clusters[1].map(cluster => {
                    return cluster['Cluster'].sort((a, b) => b.Clicked - a.Clicked);
                });

                const sorted = sortedClustersGenre.sort((a, b) => b[0].Clicked - a[0].Clicked);

                return [clusters[0], sorted];
            });

            return sortedTopics.sort((a, b) => b[1][0][0].Clicked - a[1][0][0].Clicked);
        }

        function sortPopularLanguage(topics) {
            const sortedTopics = topics.map(clusters => {
                const sortedClustersGenre = clusters[1].map(cluster => {
                    return cluster['Cluster'].sort((a, b) => b.Clicked - a.Clicked);
                });

                const sorted = sortedClustersGenre.sort((a, b) => b[0].Clicked - a[0].Clicked);

                return [clusters[0], sorted];
            });

            return sortedTopics.sort((a, b) => b[1][0][0].Clicked - a[1][0][0].Clicked);
        }


        useEffect(() => {
            const fetchClusters = async () => {
                await axios.get(`${site_domain}/api/clusters`)
                    .then(response => {
                        if (sortOption === "newest") {
                            const clusters = sortNewestCluster(response.data.clusters[1])
                            setClusters(clusters)
                            setLanguageClusters(clusters)
                        } else if (sortOption === "popular") {
                            const clusters = sortPopularCluster(response.data.clusters[1])
                            setClusters(clusters)
                            setLanguageClusters(clusters)
                        }
                    });
            };
            fetchClusters();
        }, [sortOption]);

        //console.log(languageClusters)

        const handleSortChange = (e) => {
            setSortOption(e.target.value);
        };

        const handleFilterTextChange = (newText) => {
            setFilterText(newText);
        };

        function checkAllNull() {
            let allNull = true

            languageClusters.map((topicClusters) => {
                const genreSec = GenreSection({
                    genre: topicClusters[0],
                    articles: Array.isArray(topicClusters[1]) ? topicClusters[1] : [], // Ensure articles is an array
                    filterText: filterText,
                    onFilterTextChange: handleFilterTextChange,
                    logged: usersession.user.isLogged,
                    uid: usersession.user.uid,
                    favorites: favorites,
                    setFavorites: setFavorites,
                    usersession: usersession
                })
                if (genreSec !== null) {
                    allNull = false
                }
            })
            return allNull
        }

        function filterLanguages(languages) {
            let filteredAll = clusters.map(clusters => {
                //console.log(clusters)
                const filteredClustersGenre = clusters[1].map(cluster => {
                    return cluster.filter((article) => {
                        let articleLanguage = article.Lang.toLowerCase().split('-')[0];
                        let languageFilter = true
                        if (languages.length > 0) {
                            if (articleLanguage === "nl") {
                                articleLanguage = "Nederlands"
                            } else if (articleLanguage === "en") {
                                articleLanguage = "English"
                            } else if (articleLanguage === "es") {
                                articleLanguage = "Español"
                            } else if (articleLanguage === "de") {
                                articleLanguage = "Deutsch"
                            } else if (articleLanguage === "fr") {
                                articleLanguage = "Français"
                            }
                            languageFilter = languages.some((language) =>
                                language.name.includes(articleLanguage)
                            );
                        }
                        return languageFilter
                    })
                })

                const filteredArray = filteredClustersGenre.filter((subArray) => subArray.length > 0);
                return [clusters[0], filteredArray]
            })

            filteredAll = filteredAll.filter((subArray) => subArray[1].length > 0);

            if (sortOption === "newest") {
                //console.log(filteredAll)
                const clusters = sortNewestLanguage(filteredAll)
                setLanguageClusters(clusters)
                //console.log(clusters)
            } else if (sortOption === "popular") {
                const clusters = sortPopularLanguage(filteredAll)
                setLanguageClusters(clusters)
            }
        }

        //console.log(selectedOptions)

        return (
            <div className="container-lg pt-5">
                <div>
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
                            className={`btn w-auto ms-1 btn-outline-danger heart ${filterText === '' ? 'd-none' : ''}`}
                            onClick={() => setFilterText('')}
                        >
                            X
                        </button>
                        <div className="filter-bar justify-space-between">
                            <div className="dropdown ps-2">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {sortOption ? sortOption : 'newest'}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <button className="dropdown-item" type="button" value="newest"
                                                onClick={handleSortChange}>
                                            <i className="fa fa-fire me-2" style={{color: "#c01c28"}}> </i> Newest
                                        </button>
                                    </li>
                                    <li>
                                        <a href="/genre/recommended">
                                            <button className="dropdown-item" type="button" value="recommended">
                                                <i className="fa fa-star me-2" style={{color: "#FFC300FF"}}></i>Recommended
                                            </button>
                                        </a>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type="button" value="popular"
                                                onClick={handleSortChange}>
                                            <i className="fa fa-heart me-2" style={{color: "#c01c28"}}> </i> Popular
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <form className="multiSelect">
                                    <Multiselect
                                        options={options}
                                        name="particulars"
                                        onSelect={onSelectOptions}
                                        onRemove={onRemoveOptions}
                                        displayValue="name"
                                        closeIcon="cancel"
                                        placeholder="Choose Languages"
                                        emptyRecordMsg={"No more available"}
                                        selectedValues={selectedOptions}
                                        className="multiSelectContainer"
                                    />
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    {checkAllNull() && filterText !== "" ? (
                        <>
                            <h3 style={{display: 'flex', justifyContent: 'center', marginTop: "20px"}}>
                                Sorry, we don't have what you're looking for... Here is an inspiring quote about news
                                instead!
                            </h3>
                            <Quotes/>
                        </>
                    ) : <>
                        {languageClusters.map((topicClusters) => (
                            <GenreSection key={topicClusters[0]} genre={topicClusters[0]} articles={topicClusters[1]}
                                          filterText={filterText}
                                          onFilterTextChange={handleFilterTextChange} logged={usersession.user.isLogged}
                                          uid={usersession.user.uid} favorites={favorites} setFavorites={setFavorites}
                                          usersession={usersession} languages={selectedOptions}
                            />
                        ))}
                    </>
                    }
                </div>
            </div>

        );
    }
;

export default Home;
