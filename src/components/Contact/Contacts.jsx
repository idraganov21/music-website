import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@formspree/react';
import ReCAPTCHA from "react-google-recaptcha";
import styles from './Contacts.module.css';

function Contacts() {
    const [state, handleSubmit] = useForm("moqgavnw");
    const [captchaValue, setCaptchaValue] = useState(null);
    const formRef = useRef();

    const resetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
            setCaptchaValue(null); // Reset the captcha
        }
    }

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    useEffect(() => {
        // When the form has been successfully submitted
        if (state.succeeded) {
            resetForm();
        }
    }, [state.succeeded]);
    return (
        <div className={styles.mainContent}>
            <div className={styles.wrapper}>
                <h2 className={styles.h2}>Contact Us</h2>
                <div className={styles.contactForm}>
                    <form onSubmit={handleSubmit} ref={formRef}>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" name="name" placeholder="Your name" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Your Email</label>
                                <input type="email" id="email" name="email" placeholder="Your email" />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" placeholder="Your Message"></textarea>
                        </div>
                        <div className={styles.captcha} style={{transform:"scale(0.9)", width:"600px", transformOrigin:"0 0"}}>
                            <ReCAPTCHA
                                sitekey="6Lc4oTMpAAAAAHISwGIdRihtmd4VkvSrQLNESqqb"
                                onChange={onCaptchaChange}
                                theme='dark'
                            />
                        </div>
                        <button type="submit" disabled={!captchaValue}>Send Your Message</button>
                        {state.succeeded && <div className={styles.successMessage}>Thank you for your request!</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contacts;


