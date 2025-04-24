import React, {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import {IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import styles from '../../styles/Login.module.css';
import {motion} from 'framer-motion';
import {toast, ToastContainer} from "react-toastify";

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const envLoginUrl = process.env.REACT_APP_LOGIN_URL;
    const loginUrl = envLoginUrl || '/api/idp/login';

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        if (error !== null ) {
            toast.error("Invalid email or password");
        }
    }, []);

    return (
        <motion.div
            className={styles.wrapper}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className={`${styles.left} ${isDarkMode ? styles.dark : styles.light}`}>
                <div>
                    <img src="/logo-removebg-preview.png" alt="1Bank Logo" />
                    <h1 className={styles.brandTitle}>Welcome to 1Bank</h1>
                    <p className={styles.brandSubtitle}>Reliable. Agile. Forward-thinking.</p>
                </div>
            </div>

            <div className={`${styles.right} ${isDarkMode ? styles.dark : ''}`}>
                <div className={`${styles.card} ${isDarkMode ? styles.dark : ''}`}>
                    <h2 className={styles.title}>Login</h2>
                    <form method="POST" action={loginUrl}>
                        <label htmlFor="email" className={`${styles.label} ${isDarkMode ? styles.dark : ''}`}>
                            Username
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

                        <label htmlFor="password" className={`${styles.label} ${isDarkMode ? styles.dark : ''}`}>
                            Password
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`${styles.input} ${isDarkMode ? styles.dark : ''}`}
                            />
                            <IconButton
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className={styles.eyeButton}
                                size="small"
                                disableRipple
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        </div>

                        <div className={styles.buttonRow}>
                            <button type="submit" className={styles.loginButton}>Log In</button>
                        </div>

                        <div>
                            <RouterLink to="/reset-password-email" className={styles.signupLink}>
                                Forgot password?
                            </RouterLink>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </motion.div>
    );
};

export default Login;