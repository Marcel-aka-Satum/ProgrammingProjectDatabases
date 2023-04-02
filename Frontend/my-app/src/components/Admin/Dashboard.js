import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Dashboard() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2 className="text-center text-dark mt-5">Dashboard</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center mt-3">
                        <button className="btn btn-primary m-2" onClick={() => window.location.href="/admin/articles"}>Articles</button>
                        <button className="btn btn-primary m-2" onClick={() => window.location.href="/admin/users"}>Users</button>
                        <button className="btn btn-primary m-2" onClick={() => window.location.href="/admin/rss"}>RSS</button>
                        <button className="btn btn-primary m-2" onClick={() => window.location.href="/admin/settings"}>Settings</button>
                        <button className="btn btn-primary m-2" onClick={() => window.location.href="/admin/statistics"}>Statistics</button>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Welcome to the Dashboard!</h5>
                            <p className="card-text">You can manage your Articles, Users, Settings and RSS feeds here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}