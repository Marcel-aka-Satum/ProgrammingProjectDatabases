import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from 'react';

export default function Rss() {
    const [feeds, setFeeds] = useState([
        {'id': 1, 'url': 'https://www.w3schools.com/xml/simple.xml', 'topic': 'Economics', 'publisher': 'W3Schools'},
        {'id': 2, 'url': 'https://www.w3schools.com/xml/note.xml', 'topic': 'Politics', 'publisher': 'Bob'},
        {'id': 3, 'url': 'https://www.w3schools.com/xml/cd_catalog.xml', 'topic': 'Sports', 'publisher': 'Jan'},
        {'id': 4, 'url': 'https://www.w3schools.com/xml/books.xml', 'topic': 'Economics', 'publisher': 'John'},
        {'id': 5, 'url': 'https://www.w3schools.com/xml/cd_catalog.xml', 'topic': 'Foreign', 'publisher': 'Jane'},
    ]);
    // const [feeds, setFeeds] = useState([]);
    const [url, setUrl] = useState('');
    const [topic, setTopic] = useState('');
    const [publisher, setPublisher] = useState('');

    // useEffect(() => {
    //     fetch('http://localhost:4444/api/rssfeeds')
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             setFeeds(data);
    //         })
    //         .catch((error) => {
    //             ERROR( error);
    //         });
    // }, []);
    console.log(feeds);

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

    const handleDeleteFeed = (index) => {
        setFeeds(feeds.filter((_, i) => i !== index));
    };

    const handleEditFeed = (index, feed) => {
        const newFeed = prompt('Edit Feed', feed);
        if (newFeed) {
            const updatedFeeds = feeds.map((feed, i) => (i === index ? newFeed : feed));
            setFeeds(updatedFeeds);
        }
    }

    const handleRefreshFeed = (index, feed) => {
        console.log("Refresh Feed: " + feed);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-2">
                    <h2 className="text-center text-dark mt-5">RSS Feeds</h2>
                    <form onSubmit={handleAddFeed}>
                        <div className="form-group">
                            <label htmlFor="newFeed">Add New Feed</label>
                            <input
                                type="text"
                                className="form-control"
                                id="newFeed"
                                value={newFeed}
                                onChange={(event) => setNewFeed(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Add Feed
                        </button>
                    </form>
                    <table className="table mt-5">
                        <thead>
                        <tr>
                            <th>Feed URL</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {feeds.map((feed, index) => (
                            <tr key={index}>
                                <td>{feed}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleEditFeed(index, feed)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteFeed(index)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleRefreshFeed(index, feed)}
                                    >
                                        Refresh
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
