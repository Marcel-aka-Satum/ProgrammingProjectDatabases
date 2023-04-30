import React from 'react';
import {Link} from 'react-router-dom';
import AccessDeniedImage from '../../Images/access_denied.png';

export default function Redirection() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={AccessDeniedImage} alt="Access Denied" style={{width: '20%', marginBottom: '2rem', marginTop:'3rem'}}/>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Access Denied</h2>
            <p style={{textAlign: 'center', marginBottom: '2rem'}}>You do not have permission to view this page.</p>
            <Link to="/" className="btn btn-lg btn-outline-secondary">Go Back Home</Link>
        </div>
    );
}
