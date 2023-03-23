import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState, useEffect} from 'react';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from "../Helpers/custom_alert";
import 'react-toastify/dist/ReactToastify.css';

export default function Rss() {
    const [feeds, setFeeds] = useState([]);
    let [url, setUrl] = useState('');
    let [topic, setTopic] = useState('');
    let [publisher, setPublisher] = useState('');


    const fetchFeeds = () => {
        fetch('http://localhost:4444/api/rssfeeds')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setFeeds(data);
            })
            .catch((error) => {
                ERROR(error);
            });
    }
    useEffect(() => {
            fetchFeeds();
        }
        , []);

    const addFeed = () => {
        // check if url, topic and publisher are not empty
        if (url === '' || topic === '' || publisher === '') {
            ERROR('Please fill all fields!');
            return;
        }
        // strip url, topic and publisher from whitespaces
        url = url.trim();
        topic = topic.trim();
        publisher = publisher.trim();

        // check if url is valid and is not already in the list
        if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
            ERROR('Please enter a valid URL!');
            return;
        }
        if (feeds.some((feed) => feed.URL === url)) {
            ERROR('URL already exists!');
            return;
        }


        // add feed to database to /api/add_rssfeed
        fetch('http://localhost:4444/api/add_rssfeed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    URL: url,
                    Topic: topic,
                    Publisher: publisher
                }
            )
        })
            .then(response => {
                    if (response.status === 200) {
                        SUCCESS('Feed added successfully');
                        fetchFeeds();
                    } else {
                        ERROR('Failed to add feed');
                    }
                }
            )

        setUrl('');
        setTopic('');
        setPublisher('');
        try {
            document.querySelector("#addFeedModal").style.display = "none";
            document.querySelector("#addFeedModal").classList.remove("show");
            document.querySelector("#addFeedModal").setAttribute("aria-hidden", "true");
            document.querySelector("#addFeedModal").setAttribute("style", "display: none;");
            document.querySelector("body").classList.remove("modal-open");
            document.querySelector("body").setAttribute("style", "padding-right: 0px;");
            document.querySelector(".modal-backdrop").remove();
        } catch (err) {
            // pass
        }
    }

    // Search and Filter
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const [filter, setFilter] = useState('all');
    const filteredFeeds = feeds.filter((feed) => {
        // filter by topic and url and publisher
        if (filter === 'all') {
            return feed.URL.toLowerCase().includes(searchTerm.toLowerCase()) || feed.Topic.toLowerCase().includes(searchTerm.toLowerCase()) || feed.Publisher.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return feed.Topic === filter && (feed.URL.toLowerCase().includes(searchTerm.toLowerCase()) || feed.Topic.toLowerCase().includes(searchTerm.toLowerCase()) || feed.Publisher.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const getTopics = () => {
        let topics = [];
        feeds.forEach((feed) => {
            if (!topics.includes(feed.Topic)) {
                topics.push(feed.Topic);
            }
        });
        return topics;
    }
    useEffect(() => {
        setTopics(getTopics());
    }, [feeds, getTopics]);

    // get topics of localhost:444/api/getTopics
    const [topics, setTopics] = useState(getTopics());

    const DeleteFeed = (_url) => {
        fetch(`http://127.0.0.1:4444/api/delete_rssfeed/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                URL: _url
            })
        })
            .then(response => {
                if (response.status === 200) {
                    SUCCESS(`Feed - ${_url} deleted successfully`)
                    fetchFeeds();
                } else {
                    ERROR(`Failed to delete feed - ${_url}`);
                }
            })
            .catch(() => {
                UNKNOWN_ERROR(`Failed to delete feed`);
            });
    };

    const EditFeed = (_url, _topic, _publisher) => {
        console.log('edit feed', _url, _topic, _publisher);

        fetch('http://127.0.0.1:4444/api/update_rssfeed/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    URL: _url,
                    Topic: _topic,
                    Publisher: _publisher
                }
            )
        })
            .then(response => {
                    if (response.status === 200) {
                        SUCCESS(`Feed - ${_url} edited successfully`)
                        fetchFeeds();
                    } else {
                        ERROR(`Failed to edit feed - ${_url}`);
                    }
                }
            )
            .catch(() => {
                    UNKNOWN_ERROR(`Failed to edit feed`);
                }
            );
    };


    function urlToSelector(url) {
        const base64Url = btoa(url);
        const sanitizedUrl = base64Url.replace(/=/g, ''); // remove padding characters
        return sanitizedUrl;
    }

    return (<div className="container">
        <div className="row">
            <div className="col-md-12">
                <h2 className="text-center text-dark mt-5">RSS Management System</h2>
                <div className="mb-3 col-md-4 d-flex justify-content-between">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Feed"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button
                        type="button"
                        className={`btn w-25 ms-1 btn-outline-danger ${searchTerm === '' ? 'd-none' : ''}`}
                        onClick={() => setSearchTerm('')}
                    >
                        X
                    </button>
                </div>
                <div className="btn-group mb-3">
                    <button
                        type="button"
                        className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    {topics.map((topic, index) => (<button
                        type="button"
                        className={`btn ${filter === topic ? "btn-primary" : "btn-outline-primary"}`}
                        key={index}
                        onClick={() => setFilter(topic)}
                    >
                        {topic}
                    </button>))}
                </div>
                <ul className="list-group">
                    {filteredFeeds.map((feed) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center"
                            key={feed.URL}>
                            <p>{feed.URL} > <small>{feed.Topic}</small>
                                <a href="/" onClick={(e) => {
                                    e.preventDefault();
                                    setSearchTerm(feed.Publisher);
                                }}
                                   data-toggle="tooltip"
                                   data-html="true" title="Publisher">
                                        <span className="badge bg-dark ms-2">
                                        {feed.Publisher}
                                        </span>
                                </a>
                            </p>

                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#editFeedModal-${urlToSelector(feed.URL)}`}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#deleteUserModal-${urlToSelector(feed.URL)}`}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="modal fade" id={`editFeedModal-${urlToSelector(feed.URL)}`}
                                 tabIndex="-1"
                                 aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Feed</h5>
                                            <button type="button" className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="url" className="form-label">URL</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`url-${urlToSelector(feed.URL)}`}
                                                        defaultValue={feed.URL}
                                                        disabled={true}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="topic" className="form-label">Topic</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`topic-${urlToSelector(feed.URL)}`}
                                                        defaultValue={feed.Topic}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="publisher"
                                                           className="form-label">Publisher</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`publisher-${urlToSelector(feed.URL)}`}
                                                        defaultValue={feed.Publisher}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary"
                                                    data-bs-dismiss="modal"
                                                    onClick={() => {
                                                        EditFeed(document.getElementById(`url-${urlToSelector(feed.URL)}`).value, document.getElementById(`topic-${urlToSelector(feed.URL)}`).value, document.getElementById(`publisher-${urlToSelector(feed.URL)}`).value);
                                                    }}>Apply Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id={`deleteUserModal-${urlToSelector(feed.URL)}`}
                                 tabIndex="-1"
                                 aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Delete Feed</h5>
                                            <button type="button" className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Are you sure you want to delete Feed {<a
                                                href={feed.URL}>{feed.URL}</a>} ?</p>
                                            {/* also mention the topic of the feed in a badge*/}
                                            Topic: <p className="badge bg-dark">{feed.Topic}</p>
                                            <br/>
                                            Publisher: <p className="badge bg-dark">{feed.Publisher}</p>
                                            <br/>
                                            <small className="text-muted">This action cannot be
                                                undone.</small>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-danger"
                                                    data-bs-dismiss="modal"
                                                    onClick={() => {
                                                        DeleteFeed(feed.URL);
                                                    }}>Delete Feed
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                    ))}
                </ul>

                <div className="mt-3">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addFeedModal"
                    >
                        Add Feed
                    </button>
                    <div className="modal fade" id="addFeedModal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Feed</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">URL</label>
                                            <input type="text" className="form-control" id="username"
                                                   value={url}
                                                   onChange={(e) => setUrl(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="topic" className="form-label">Topic</label>
                                            <input type="text" className="form-control" id="topic" value={topic}
                                                   onChange={(e) => setTopic(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="publisher" className="form-label">Publisher</label>
                                            <input type="text" className="form-control" id="publisher"
                                                   value={publisher}
                                                   onChange={(e) => setPublisher(e.target.value)}/>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={addFeed}>Add Feed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>);
}