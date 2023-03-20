import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState, useEffect} from 'react';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from "../Helpers/custom_alert";
import 'react-toastify/dist/ReactToastify.css';

export default function Rss() {
    const [feeds, setFeeds] = useState([
        {'id': 1, 'url': 'https://www.w3schools.com/xml/simple.xml', 'topic': 'Economics', 'publisher': 'W3Schools'},
        {'id': 2, 'url': 'https://www.w3schools.com/xml/note.xml', 'topic': 'Politics', 'publisher': 'Merkel'},
        {'id': 3, 'url': 'https://www.w3schools.com/xml/cd_catalog.xml', 'topic': 'Sports', 'publisher': 'Trump'},
        {'id': 4, 'url': 'https://www.w3schools.com/xml/books.xml', 'topic': 'Economics', 'publisher': 'Biden'},
        {'id': 5, 'url': 'https://www.w3schools.com/xml/cd_catalog.xml', 'topic': 'Foreign', 'publisher': 'Putin'},
    ]);
    const [url, setUrl] = useState('');
    const [topic, setTopic] = useState('');
    const [publisher, setPublisher] = useState('');

    const addFeed = () => {

        // check if url, topic and publisher are not empty
        if (url === '' || topic === '' || publisher === '') {
            ERROR('Please fill all fields!');
            return;
        }
        setFeeds([...feeds, {'url': url, 'topic': topic, 'publisher': publisher}]);
        SUCCESS('Feed added successfully!');
        refreshTopics();
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
            console.log(err);
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
            return feed.url.toLowerCase().includes(searchTerm.toLowerCase()) || feed.topic.toLowerCase().includes(searchTerm.toLowerCase()) || feed.publisher.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return feed.topic === filter && (feed.url.toLowerCase().includes(searchTerm.toLowerCase()) || feed.topic.toLowerCase().includes(searchTerm.toLowerCase()) || feed.publisher.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const getTopics = () => {
        let topics = [];
        feeds.forEach((feed) => {
            if (!topics.includes(feed.topic)) {
                topics.push(feed.topic);
            }
        });
        return topics;
    }
    useEffect(() => {
        setTopics(getTopics());
    }, [feeds]);
    const refreshTopics = () => {
        setTopics(getTopics());
    }

    // get topics of localhost:444/api/getTopics
    const [topics, setTopics] = useState(getTopics());
    const handleGetTopics = () => {
        fetch('http://localhost:444/api/getTopics')
            .then((response) => response.json())
            .then((data) => {
                setTopics(data);
            })
            .catch((error) => {
                    UNKNOWN_ERROR(error);
                }
            );
    }
    const DeleteFeed = (id) => {
        console.log(id);
        setFeeds(feeds.filter((feed) => feed.id !== id));
        SUCCESS('Feed deleted successfully!');
        refreshTopics();
    }
    const EditFeed = (id, _url, _topic, _publisher) => {
        console.log('edit feed', _url, _topic, _publisher);
        setFeeds(feeds.map((feed) => feed.id === id ? {
            ...feed,
            url: _url,
            topic: _topic,
            publisher: _publisher
        } : feed));
        SUCCESS('Feed edited successfully!');
        refreshTopics();
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-2">
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
                        {topics.map((topic, index) => (
                            <button
                                type="button"
                                className={`btn ${filter === topic ? "btn-primary" : "btn-outline-primary"}`}
                                key={index}
                                onClick={() => setFilter(topic)}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                    <ul className="list-group">
                        {filteredFeeds.map((feed, index) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center"
                                key={feed.id}>
                                <p>{feed.url} > <small>{feed.topic}</small>
                                    <a href="/" onClick={(e) => {
                                        e.preventDefault();
                                        setSearchTerm(feed.publisher);
                                    }}
                                       data-toggle="tooltip"
                                       data-html="true" title="Publisher">
                                        <span className="badge bg-dark ms-2">
                                        {feed.publisher}
                                        </span>
                                    </a>
                                </p>

                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#editFeedModal-${feed.id}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#deleteUserModal-${feed.id}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="modal fade" id={`editFeedModal-${feed.id}`} tabIndex="-1"
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
                                                            id={`url-${feed.id}`}
                                                            defaultValue={feed.url}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="topic" className="form-label">Topic</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`topic-${feed.id}`}
                                                            defaultValue={feed.topic}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="publisher"
                                                               className="form-label">Publisher</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`publisher-${feed.id}`}
                                                            defaultValue={feed.publisher}
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
                                                            EditFeed(feed.id,
                                                                document.getElementById(`url-${feed.id}`).value,
                                                                document.getElementById(`topic-${feed.id}`).value,
                                                                document.getElementById(`publisher-${feed.id}`).value);
                                                        }}>Apply Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal fade" id={`deleteUserModal-${feed.id}`} tabIndex="-1"
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
                                                <p>Are you sure you want to delete Feed {feed.url}?</p>
                                                {/* also mention the topic of the feed in a badge*/}
                                                Topic: <p className="badge bg-dark">{feed.topic}</p>
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
                                                            DeleteFeed(feed.id);
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
        </div>
    );
}
