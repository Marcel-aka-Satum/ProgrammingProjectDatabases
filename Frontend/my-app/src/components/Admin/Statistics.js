import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import {SUCCESS, INFO} from "../Helpers/custom_alert";


export default function Statistics() {
    const [totalusers, setTotalUsers] = React.useState(0);
    const [totalarticles, setTotalArticles] = React.useState(0);
    const [totalrss, setTotalRSS] = React.useState(0);

    useEffect(() => {
            async function fetchData() {
                const r_user = await fetch('http://localhost:4444/api/users/totalusers')
                const d_user = await r_user.json();
                setTotalUsers(d_user.totalUsers);

                const r_article = await fetch('http://localhost:4444/api/articles/totalarticles')
                const d_article = await r_article.json();
                setTotalArticles(d_article.totalArticles);

                const r_rss = await fetch('http://localhost:4444/api/rssfeeds/totalrssfeeds')
                const d_rss = await r_rss.json();
                setTotalRSS(d_rss.totalRSSFeeds);
            }
            fetchData();
        }
        , []);



    const refreshStats = async () => {
        const r_users = await fetch('http://localhost:4444/api/users/totalusers')
        const d_users = await r_users.json();
        const total_users = d_users.totalUsers;

        const r_articles = await fetch('http://localhost:4444/api/articles/totalarticles')
        const d_articles = await r_articles.json();
        const total_articles = d_articles.totalArticles;

        const r_rss = await fetch('http://localhost:4444/api/rssfeeds/totalrssfeeds')
        const d_rss = await r_rss.json();
        const total_rss = d_rss.totalRSSFeeds;


        if (totalusers === total_users) {
            INFO("Total Users same as before.")
        } else {
            SUCCESS("Total Users Updated from " + totalusers + " to " + total_users)
        }

        if (totalarticles === total_articles) {
            INFO("Total Articles same as before.")
        } else {
            SUCCESS("Total Articles Updated from " + totalarticles + " to " + total_articles)
        }

        if (totalrss === total_rss) {
            INFO("Total RSS Feeds same as before.")
        } else {
            SUCCESS("Total RSS Feeds Updated from " + totalrss + " to " + total_rss)
        }


        setTotalUsers(d_users.totalUsers);
        // setTotalArticles(d_articles.totalArticles);
        setTotalRSS(d_rss.totalRSSFeeds);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2 className="text-center text-dark mt-5">Statistics</h2>
                    <button
                        className="btn btn-success offset-5 mt-3"
                        onClick={refreshStats}
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">Users</h4>
                            <p className="card-text">Total Users: {totalusers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">Articles</h4>
                            <p className="card-text">Total Articles: {totalarticles}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">RSS Feed Links</h4>
                            <p className="card-text">Total RSS Feeds: {totalrss}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
