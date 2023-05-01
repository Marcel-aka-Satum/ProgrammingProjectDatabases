import React, {useContext, useEffect, useState} from 'react';
import {SUCCESS, ERROR} from "../Helpers/custom_alert";
import 'bootstrap/dist/css/bootstrap.min.css';
import './tool.css'
import {userSession} from "../../App";

export default function Settings() {
    // User session
    let usersession = useContext(userSession);

    // Scraper settings
    const [selectedUpdateInterval, setSelectedUpdateInterval] = useState('1440');
    const [currentSelectedUpdateInterval, setCurrentSelectedUpdateInterval] = useState(selectedUpdateInterval);

    // Rss settings

    // Debug settings
    const [selectedDebug, setSelectedDebug] = useState(usersession.user.getDebug());
    const [currentSelectedDebug, setCurrentSelectedDebug] = useState(selectedDebug);


    useEffect(() => {
        setCurrentSelectedUpdateInterval(selectedUpdateInterval);
    }, [selectedUpdateInterval]);

    const applySettings = async () => {
        if (isNaN(currentSelectedUpdateInterval) || currentSelectedUpdateInterval < 1 || currentSelectedUpdateInterval > 10080) {
            setCurrentSelectedUpdateInterval(selectedUpdateInterval);
            ERROR("Update interval must be a number between 1 and 10080");
            return;
        }
        setSelectedUpdateInterval(currentSelectedUpdateInterval);

        setSelectedDebug(currentSelectedDebug);
        usersession.user.updateUserInfo(
            usersession.user.getUsername(),
            usersession.user.getEmail(),
            usersession.user.getUid(),
            usersession.user.getIsAdmin(),
            selectedDebug
        )
        console.log(usersession.user.printUserInfo())

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

                                            } minutes
                                            {currentSelectedUpdateInterval >= 1440 ? ` (${Math.floor(currentSelectedUpdateInterval / 1440)} days and ${Math.floor((currentSelectedUpdateInterval % 1440) / 60)} hours)` :
                                                currentSelectedUpdateInterval >= 60 ? ` (${Math.floor(currentSelectedUpdateInterval / 60)} hours and ${currentSelectedUpdateInterval % 60} minutes)` : ''}

                                            <b className="float-end">Current: {selectedUpdateInterval} minutes</b>
                                            <input type="range" className="form-range" min="1" max="10080" step="1"
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

