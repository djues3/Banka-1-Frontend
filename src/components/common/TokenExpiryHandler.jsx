import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const TokenExpiryHandler = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);
    const { isLoggedIn, logout } = useAuth();

    const scheduleExpiryCheck = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch {
            return;
        }
        const now = Date.now();
        const expMs = decoded.exp * 1000;
        const msUntilExpiry = expMs - now;

        if (msUntilExpiry <= 0) {
            setOpen(true);
        } else {
            timeoutRef.current = window.setTimeout(() => {
                setOpen(true);
            }, msUntilExpiry);
        }
    };

    useEffect(() => {
    if (isLoggedIn){
        scheduleExpiryCheck();
        const onStorage = (e) => {
            if (e.key === 'token') {
                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current);
                }
                scheduleExpiryCheck();
            }
        };
        window.addEventListener('storage', onStorage);

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            window.removeEventListener('storage', onStorage);
        };
    }
    }, [isLoggedIn]);

    const handleLoginRedirect = () => {
        setOpen(false);
        // logout();
        navigate('/login');
    };

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown
            aria-labelledby="token-expired-dialog-title"
            aria-describedby="token-expired-dialog-description"
        >
            <DialogTitle id="token-expired-dialog-title">
                Session Expired
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="token-expired-dialog-description">
                    Your session has expired. Please log in again to continue.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLoginRedirect} variant="contained">
                    Go to Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TokenExpiryHandler;