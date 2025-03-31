import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
import { useTheme } from '@mui/material/styles';

const PasswordReset = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await axios.put('/api/users/reset-password/', { email });
            setSubmitted(true);
        } catch (err) {
            console.error('Error requesting password reset:', err);
            setError('Failed to request password reset. Please try again.');
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.left} ${isDarkMode ? styles.dark : styles.light}`}>
                <div>
                    <img src="/logo-removebg-preview.png" alt="1Bank Logo" />
                    <h1 className={styles.brandTitle}>Welcome to 1Bank</h1>
                    <p className={styles.brandSubtitle}>Reliable. Agile. Forward-thinking.</p>
                </div>
            </div>

            <div className={`${styles.right} ${isDarkMode ? styles.dark : ''}`}>
                <div className={`${styles.card} ${isDarkMode ? styles.dark : ''}`}>
                    <h2 className={styles.title}>Reset Password</h2>

                    {!submitted ? (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email" className={`${styles.label} ${isDarkMode ? styles.dark : ''}`}>
                                Enter your email address
                            </label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`${styles.input} ${isDarkMode ? styles.dark : ''}`}
                                />
                            </div>

                            {error && (
                                <p style={{ color: 'red', fontSize: '14px', marginTop: '-12px' }}>{error}</p>
                            )}

                            <div className={styles.buttonRow}>
                                <button
                                    type="submit"
                                    className={styles.loginButton}
                                    disabled={!email}
                                >
                                    Send Reset Link
                                </button>
                            </div>

                            <div className={styles.signupLink} onClick={() => navigate('/login')}>
                                Back to Login
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <h3>Check your email</h3>
                            <p>
                                If an account exists with <strong>{email}</strong>, we’ve sent password reset instructions.
                            </p>
                            <div className={styles.buttonRow}>
                                <button
                                    type="button"
                                    className={styles.loginButton}
                                    onClick={() => navigate('/login')}
                                >
                                    Return to Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;