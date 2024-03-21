// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import LoginHeader from '../LoginHeader/LoginHeader';
import ReCAPTCHA from "react-google-recaptcha";
import LoginFooter from '../LoginFooter/LoginFooter';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!captchaValue) {
            setErrorMessage("Please verify the captcha");
            return;
        }

        try {
            const response = await fetch(`${strapiBaseUrl}/api/auth/local`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: username, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.jwt);

                const userRole = data.user.Rolya;
                localStorage.setItem('userRole', userRole);
                // Store username and messages
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('messages', JSON.stringify(data.user.message));
                navigate('/home');
            } else {
                setErrorMessage('Username or password are incorrect');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Login failed due to an error!');
        }
    };


    return (
        <><LoginHeader /><div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Login</h2>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <label className={styles.remember}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)} />
                    <span></span>
                    Remember me
                </label>
                <div className={styles.captcha} style={{ transform: "scale(0.9)", width: "600px", marginLeft: "130px", marginTop: "20px", transformOrigin: "0 0" }}>
                    <ReCAPTCHA
                        sitekey="6Lc4oTMpAAAAAHISwGIdRihtmd4VkvSrQLNESqqb"
                        onChange={onCaptchaChange}
                        theme='dark'
                    />
                </div>
                <button type="submit">Login</button>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            </form>
        </div>
        <div className={styles.footerLogin}>
            <LoginFooter />

        </div>
        </>
    );
}

export default LoginPage;