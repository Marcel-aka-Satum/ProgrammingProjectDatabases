import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaSpinner} from 'react-icons/fa';

export default function Rss() {
    const [feeds, setFeeds] = useState([]);
    const [newFeed, setNewFeed] = useState('');
    const [feedStatus, setFeedStatus] = useState({});

    const handleAddFeed = (event) => {
        event.preventDefault();
        if (newFeed.trim() === '') {
            toast.error('You cannot add an empty RSS feed', {
                autoClose: 3000,
                progressStyle: {
                    background: 'red'
                },
                bodyStyle: {
                    color: 'black'
                },

            });
        } else {
            setFeeds([...feeds, newFeed]);
            setFeedStatus({...feedStatus, [newFeed]: {}});
            setNewFeed('');
        }
    };

    const handleDeleteFeed = (index) => {
        setFeeds(feeds.filter((_, i) => i !== index));
        const deletedFeed = feeds[index];
        const {[deletedFeed]: deleted, ...rest} = feedStatus;
        setFeedStatus(rest);
    };

    const handleEditFeed = (index, feed) => {
        const newFeed = prompt('Edit Feed', feed);
        if (newFeed) {
            const updatedFeeds = feeds.map((feed, i) => (i === index ? newFeed : feed));
            setFeeds(updatedFeeds);
            setFeedStatus({...feedStatus, [newFeed]: feedStatus[feed]});
            const {[feed]: deleted, ...rest} = feedStatus;
            setFeedStatus(rest);
        }
    }

    const handleRefreshFeed = async (index, feed) => {

        console.log("refreshing feed: ", feed);

        const requestOptions = {
            method: "GET",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/rss+xml"
            }
        };

        try {
            setFeedStatus({...feedStatus, [feed]: {loading: true, status: "loading"}});

            const response = await fetch(feed, requestOptions);
            console.log(response);

            setTimeout(() => {
                if (response.status === 200) {
                    setFeedStatus({...feedStatus, [feed]: {loading: false, status: "success"}});
                    toast.success('Feed refreshed successfully', {
                        autoClose: 3000,
                        progressStyle: {
                            background: 'green'
                        },
                        bodyStyle: {
                            color: 'black'
                        },
                    });
                } else {
                    setFeedStatus({...feedStatus, [feed]: {loading: false, status: "failure"}});
                    toast.error('Feed refresh failed', {
                        autoClose: 3000,
                        progressStyle: {
                            background: 'red'
                        },
                        bodyStyle: {
                            color: 'black'
                        },
                    });
                }
            }, 3000); // delay the setFeedStatus calls for 3 seconds
        } catch (error) {
            setFeedStatus({...feedStatus, [feed]: {loading: false, status: "failure"}});
        }
    };


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
                                        {feedStatus[feed]?.loading ?
                                            <FaSpinner className="spinner"/> : "Refresh"
                                        }
                                    </button>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer limit={3}/>
        </div>
    );
}
