import React, {useContext, useEffect, useState} from 'react';
import {SUCCESS, ERROR} from "../Helpers/custom_alert";
import 'bootstrap/dist/css/bootstrap.min.css';
import './tool.css'
import {userSession} from "../../App";
import axios from "axios";
import {request_headers, site_domain} from "../../globals";

export default function Settings() {
    // User session
    let usersession = useContext(userSession);

    // Scraper settings
    const [selectedUpdateInterval, setSelectedUpdateInterval] = useState("0");
    useEffect(() => {
        async function fetchSettings() {
            const r_settings = await fetch(`${site_domain}/api/settings`)
            const data = await r_settings.json();
            const updateInterval = data.scraperTimer
            setSelectedUpdateInterval(updateInterval);
        }

        fetchSettings();
    }, []);
    const [currentSelectedUpdateInterval, setCurrentSelectedUpdateInterval] = useState(selectedUpdateInterval);


    // Rss settings

    // Debug settings
    const [selectedDebug, setSelectedDebug] = useState(usersession.user.getDebug());
    const [currentSelectedDebug, setCurrentSelectedDebug] = useState(selectedDebug);


    useEffect(() => {
        setCurrentSelectedUpdateInterval(selectedUpdateInterval);
    }, [selectedUpdateInterval]);

    const applySettings = async () => {
        if (isNaN(currentSelectedUpdateInterval) || currentSelectedUpdateInterval < 1 || currentSelectedUpdateInterval > 86400) {
            setCurrentSelectedUpdateInterval(selectedUpdateInterval);
            ERROR("Update interval must be a number between 1 and 86400");
            return;
        }
        setSelectedUpdateInterval(currentSelectedUpdateInterval);

        fetch(`${site_domain}/api/update_settings`, {
            method: 'POST',
            headers: request_headers,
            body: JSON.stringify({
                setting: 'scraperTimer',
                value: currentSelectedUpdateInterval,
            }),
        })


        setSelectedDebug(currentSelectedDebug);
        usersession.user.updateUserInfo(
            usersession.user.getUsername(),
            usersession.user.getEmail(),
            usersession.user.getUid(),
            usersession.user.getIsAdmin(),
            currentSelectedDebug
        )
        // console.log(usersession.user.printUserInfo())

        SUCCESS("Settings applied");
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mt-5">
                    <h2 className="text-center text-dark mb-5">Settings</h2>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group">
                                    {/*Category settings*/}
                                    <h5 className="mb-3 d-block">Scraper Settings</h5>
                                    <div className="card mb-4 ms-3">
                                        <div className="m-3">
                                            <b>
                                                <abbr title="" data-toggle="tooltip" data-placement="top"
                                                      data-original-title="Select how often the scraper should update.">Update
                                                    Interval:
                                                </abbr>
                                            </b>

                                            {
                                                <input
                                                    type="number" className="form-control w-25 d-inline-block ms-2"
                                                    value={currentSelectedUpdateInterval}
                                                    onChange={(e) => setCurrentSelectedUpdateInterval(e.target.value)}/>

                                            } seconds
                                            {currentSelectedUpdateInterval >= 3600 ? ` (${Math.floor(currentSelectedUpdateInterval / 3600)} hours and ${Math.floor((currentSelectedUpdateInterval % 3600) / 60)} minutes)` :
                                            currentSelectedUpdateInterval >= 60 ? ` (${Math.floor(currentSelectedUpdateInterval / 60)} minutes and ${currentSelectedUpdateInterval % 60} seconds)` : ` (${currentSelectedUpdateInterval} seconds)`}

                                            <b className="float-end">Current: {selectedUpdateInterval} seconds</b>
                                            <input type="range" className="form-range" min="1" max="86400" step="1"
                                                   value={currentSelectedUpdateInterval}
                                                   onChange={(e) => setCurrentSelectedUpdateInterval(e.target.value)}/>
                                        </div>
                                    </div>


                                    {/*Rss settings*/}
                                    <h5 className="mb-3 d-block">Rss Settings</h5>
                                    <div className="card mb-4 ms-3">
                                        <div className="m-3">
                                            <b>Not implemented yet</b>
                                        </div>
                                    </div>

                                    {/*Debug settings*/}
                                    <h5 className="mb-3 d-block">Debug Settings</h5>
                                    <div className="card mb-4 ms-3">
                                        <div className="m-3">
                                            {/*    add a checkbox the enable or disable*/}
                                            <b>Debug Mode: </b>
                                            <input type="checkbox" className="form-check-input ms-2"
                                                   checked={currentSelectedDebug}
                                                   onChange={(e) => setCurrentSelectedDebug(e.target.checked)}/>
                                            <b className="float-end">Current: {selectedDebug ? 'Enabled' : 'Disabled'}</b>

                                            <div className="form-text">Enabling debug mode will show you more
                                                information
                                                about the current stats of articles.
                                                <br/>This will only be visible to the admin user. So only visible to
                                                you !
                                            </div>


                                        </div>
                                    </div>


                                </div>
                                <button type="button" className="btn btn-primary w-25" onClick={applySettings}>Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

