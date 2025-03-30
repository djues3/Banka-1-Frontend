import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
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
            const response = await axios.put('/api/users/reset-password/', { email });
            console.log('Password reset request successful:', response.data);
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
                                Email Address
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
                                <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
                                    {error}
                                </p>
                            )}

                            <div className={styles.buttonRow}>
                                <button
                                    type="submit"
                                    className={styles.loginButton}
                                    disabled={!email}
                                >
                                    Reset Password
                                </button>
                            </div>

                            <div>
                                <span
                                    className={styles.signupLink}
                                    onClick={() => navigate('/login')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Back to login
                                </span>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                                If an account exists with <b>{email}</b>, we’ve sent password reset instructions.
                            </p>
                            <button
                                className={styles.loginButton}
                                onClick={() => navigate('/login')}
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;