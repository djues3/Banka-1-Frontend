import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setupPassword } from '../../services/AxiosUser';
import { Alert, CircularProgress } from '@mui/material';
import styles from '../../styles/Login.module.css';

const PasswordSetConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [location]);

    const validatePassword = (password) => {
        const hasNumber = /[0-9]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasNumber) return "Password must contain at least 1 number";
        if (!hasUpperCase) return "Password must contain at least 1 uppercase letter";
        if (password.length < 8) return "Password must be at least 8 characters long";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsSubmitting(true);
        try {
            await setupPassword(token, password);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password. The link may have expired.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.wrapper}>
                <div className={`${styles.left} ${styles.dark}`}>
                    <div>
                        <img src="/logo-removebg-preview.png" alt="1Bank Logo" />
                        <h1 className={styles.brandTitle}>Welcome to 1Bank</h1>
                        <p className={styles.brandSubtitle}>Reliable. Agile. Forward-thinking.</p>
                    </div>
                </div>
                <div className={`${styles.right} ${styles.dark}`}>
                    <div className={`${styles.card} ${styles.dark}`}>
                        <h2 className={styles.title}>Invalid Link</h2>
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            The password set link is invalid or has expired.
                        </Alert>
                        <button onClick={() => navigate('/reset-password-email')} className={styles.loginButton}>
                            Request New Link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.left} ${styles.dark}`}>
                <div>
                    <img src="/logo-removebg-preview.png" alt="1Bank Logo" />
                    <h1 className={styles.brandTitle}>Welcome to 1Bank</h1>
                    <p className={styles.brandSubtitle}>Reliable. Agile. Forward-thinking.</p>
                </div>
            </div>
            <div className={`${styles.right} ${styles.dark}`}>
                <div className={`${styles.card} ${styles.dark}`}>
                    <h2 className={styles.title}>Set Your Password</h2>
                    {success ? (
                        <>
                            <Alert severity="success" sx={{ marginBottom: '16px' }}>
                                Your password has been successfully set!
                            </Alert>
                            <button onClick={() => navigate('/login')} className={styles.loginButton}>
                                Go to Login
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className={styles.label}>Password must be at least 8 characters, 1 uppercase, 1
                                number.</p>
                            {error && (
                                <Alert severity="error" sx={{marginBottom: '16px'}}>
                                    {error}
                                </Alert>
                            )}
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <button type="submit" className={styles.loginButton} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <CircularProgress size={20} style={{marginRight: 8}}/>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Set Password'
                                    )}
                                </button>
                            </div>
                            <div className={styles.buttonRow}>
                                <button type="button" onClick={() => navigate('/login')} className={styles.loginButton}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                        )}
                </div>
            </div>
        </div>
    );
};

export default PasswordSetConfirmation;