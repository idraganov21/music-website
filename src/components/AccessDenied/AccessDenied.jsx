import React from 'react';
import styles from './AccessDenied.module.css'
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1> Ooops Access Denied</h1>
            <p>You do not have permission to view this page.</p>
            <button onClick={() => navigate('/')}>Go Home</button>
        </div>
    );
};

export default AccessDenied;
