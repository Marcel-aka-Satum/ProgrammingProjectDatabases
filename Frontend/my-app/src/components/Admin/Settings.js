import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Settings() {
    const [selectedRecommendationSystem, setSelectedRecommendationSystem] = React.useState('Simple Recommender System (timestamp)');
    const [selectedClassificationAlgorithm, setSelectedClassificationAlgorithm] = React.useState('Simple Algorithm (word count)');
    const [selectedUpdateInterval, setSelectedUpdateInterval] = React.useState('1440');
    const [notifyAdmins, setNotifyAdmins] = React.useState(true);

    const handleIntervalChange = (e) => {
        if (e.target.value === '0') {
            setNotifyAdmins(false);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mt-5">
                    <h2 className="text-center text-dark mb-5">Settings</h2>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="recommendation-system">Choose a Recommendation System</label>
                                        <select className="form-control" id="recommendation-system" value={selectedRecommendationSystem} onChange={e => setSelectedRecommendationSystem(e.target.value)}>
                                            <option>Simple Recommender System (timestamp)</option>
                                            <option>Advanced Recommender System (collaborative filtering)</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="classification-algorithm">Choose a Classification Algorithm</label>
                                        <select className="form-control" id="classification-algorithm" value={selectedClassificationAlgorithm} onChange={e => setSelectedClassificationAlgorithm(e.target.value)}>
                                            <option>Simple Algorithm (word count)</option>
                                        </select>
                                    </div>
                                    <div className="form-group form-check mb-3">
                                        <input type="checkbox" className="form-check-input" id="notify-admins" disabled={!notifyAdmins} checked={notifyAdmins} />
                                        <label className="form-check-label" htmlFor="notify-admins">Notify admins if any of the RSS feeds are not responsive</label>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Choose an interval to check whether the RSS feeds are responsive</label>
                                        <select className="form-control w-50" onChange={handleIntervalChange}>
                                            <option value="0">Never</option>
                                            <option value="5">Every 5 minutes</option>
                                            <option value="10">Every 10 minutes</option>
                                            <option value="15">Every 15 minutes</option>
                                            <option value="30">Every 30 minutes</option>
                                            <option value="60">Every hour</option>
                                            <option value="360">Every 6 hours</option>
                                            <option value="720">Every 12 hours</option>
                                            <option value="1440" selected={true}>Every day</option>
                                            <option value="10080">Every week</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <h5 className="mb-3 d-block text-center">Current Settings</h5>
                                        <p><b>Recommendation System:</b> {selectedRecommendationSystem}</p>
                                        <p><b>Classification Algorithm:</b> {selectedClassificationAlgorithm}</p>
                                        <p><b>Notify Admins:</b> {notifyAdmins ? 'Yes' : 'No'}</p>
                                        <p><b>Update Interval:</b> {selectedUpdateInterval} minutes</p>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}