import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from 'react';

export default function Rss() {
    const [feeds, setFeeds] = useState([]);
    const [newFeed, setNewFeed] = useState('');

    const handleAddFeed = (event) => {
        event.preventDefault();
        setFeeds([...feeds, newFeed]);
        setNewFeed('');
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
