import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import {SUCCESS, INFO} from "../Helpers/custom_alert";


export default function Statistics() {
    const [totalusers, setTotalUsers] = React.useState(0);
    const [totalvisitors, setTotalVisitors] = React.useState(0);
    const [totalarticles, setTotalArticles] = React.useState(0);
    const [totalrss, setTotalRSS] = React.useState(0);
    const [totalfavorites, setTotalFavorites] = React.useState(0);
    const [totaltopics, setTotalTopics] = React.useState(0);

    useEffect(() => {
            async function fetchData() {
                const r_user = await fetch('http://localhost:4444/api/users/totalusers')
                const d_user = await r_user.json();
                setTotalUsers(d_user.totalUsers);

                const r_visitor = await fetch('http://localhost:4444/api/visitors')
                const d_visitor = await r_visitor.json();
                setTotalVisitors(d_visitor.visitors.length);

                const r_article = await fetch('http://localhost:4444/api/articles/totalarticles')
                const d_article = await r_article.json();
                setTotalArticles(d_article.totalArticles);

                const r_rss = await fetch('http://localhost:4444/api/rssfeeds/totalrssfeeds')
                const d_rss = await r_rss.json();
                setTotalRSS(d_rss.totalRSSFeeds);

                const r_favorites = await fetch('http://localhost:4444/api/favorites')
                const d_favorites = await r_favorites.json();
                let total = 0;

                if (d_favorites.favorites) {
                    for (let favorite of Object.values(d_favorites.favorites)) {
                        total += favorite.length;
                    }
                }
                setTotalFavorites(total);

                const r_topics = await fetch('http://localhost:4444/api/topics')
                const d_topics = await r_topics.json();
                setTotalTopics(d_topics.topics.length);
            }

            fetchData();
        }
        , []);


    const refreshStats = async () => {
        const r_users = await fetch('http://localhost:4444/api/users/totalusers')
        const d_users = await r_users.json();
        const total_users = d_users.totalUsers;

        const r_visitors = await fetch('http://localhost:4444/api/visitors')
        const d_visitors = await r_visitors.json();
        const total_visitors = d_visitors.visitors.length;

        const r_articles = await fetch('http://localhost:4444/api/articles/totalarticles')
        const d_articles = await r_articles.json();
        const total_articles = d_articles.totalArticles;

        const r_rss = await fetch('http://localhost:4444/api/rssfeeds/totalrssfeeds')
        const d_rss = await r_rss.json();
        const total_rss = d_rss.totalRSSFeeds;

        const r_favorites = await fetch('http://localhost:4444/api/favorites')
        const d_favorites = await r_favorites.json();
        let total = 0;
        if (d_favorites.favorites) {
            for (let favorite of Object.values(d_favorites.favorites)) {
                total += favorite.length;
            }
        }
        const total_favorites = total;

        const r_topics = await fetch('http://localhost:4444/api/topics')
        const d_topics = await r_topics.json();
        const total_topics = d_topics.topics.length;


        if (totalusers === total_users) {
            INFO("Total Users same as before.")
        } else {
            SUCCESS("Total Users Updated from " + totalusers + " to " + total_users)
        }

        if (totalvisitors === total_visitors) {
            INFO("Total Visitors same as before.")
        } else {
            SUCCESS("Total Visitors Updated from " + totalvisitors + " to " + total_visitors)
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

        if (totalfavorites === total_favorites) {
            INFO("Total Favorites same as before.")
        }
        else {
            SUCCESS("Total Favorites Updated from " + totalfavorites + " to " + total_favorites)
        }

        if (totaltopics === total_topics) {
            INFO("Total Topics same as before.")
        }
        else {
            SUCCESS("Total Topics Updated from " + totaltopics + " to " + total_topics)
        }


        setTotalUsers(total_users);
        setTotalVisitors(total_visitors);
        setTotalArticles(total_articles);
        setTotalRSS(total_rss);
        setTotalFavorites(total_favorites);
        setTotalTopics(total_topics);
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
                            <h4 className="card-title">Visitors</h4>
                            <p className="card-text">Total Visitors: {totalvisitors}</p>
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
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">Favorites</h4>
                            <p className="card-text">Total Favorites: {totalfavorites}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">Topics</h4>
                            <p className="card-text">Total Topics: {totaltopics}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
