import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Dashboard() {
    return (
        <div class="container">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center text-dark mt-5">Dashboard</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="text-center mt-3">
                        <button class="btn btn-primary m-2" onClick={() => window.location.href="/admin/articles"}>Articles</button>
                        <button class="btn btn-primary m-2" onClick={() => window.location.href="/admin/users"}>Users</button>
                        <button class="btn btn-primary m-2" onClick={() => window.location.href="/admin/settings"}>Settings</button>
                        <button class="btn btn-primary m-2" onClick={() => window.location.href="/admin/rss"}>RSS</button>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Welcome to the Dashboard!</h5>
                            <p class="card-text">You can manage your Articles, Users, Settings and RSS feeds here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}