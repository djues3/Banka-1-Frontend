import React, { useState } from 'react';
import {  Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../../services/AxiosUser';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../../styles/Login.module.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await loginUser(email, password);
            const token = response.data.token;

            login(token);
        } catch (error) {
            console.log(error);
            alert('Invalid email or password');
        }
    };

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
                    <form onSubmit={handleSubmit}>
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
        </motion.div>
    );
};

export default Login;