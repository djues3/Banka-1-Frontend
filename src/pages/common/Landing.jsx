import React, { useRef } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const MotionButton = motion(Button);
const MotionBox = motion(Box);

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const scrollTargetRef = useRef(null);
    const bgControls = useAnimation();

    const bounceAnimation = {
        y: [10, -18, 10],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const logoSrc = theme.palette.mode === 'dark'
        ? '/logo-removebg-preview.png'
        : '/logo-removebg-invert.png';

    const handleLoginScroll = async () => {
        await bgControls.start({
            backgroundColor: [
                theme.palette.background.default,
                theme.palette.mode === 'dark' ? '#1a1a1a' : '#f2f2f2',
                '#595992'
            ],
            transition: {
                duration: 1.5,
                ease: 'easeInOut'
            }
        });

        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => navigate('/login'), 1200);
    };

    return (
        <>
            <MotionBox
                animate={bgControls}
                transition={{ duration: 1 }}
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Container maxWidth="md">
                    <Box
                        component={motion.div}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component={motion.div}
                            variants={itemVariants}
                            sx={{
                                mb: 10,
                                width: '100%',
                                maxWidth: 500,
                            }}
                        >
                            <img
                                src={logoSrc}
                                alt="1Bank Logo"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Box>

                        <Box
                            component={motion.div}
                            variants={itemVariants}
                            sx={{ textAlign: 'center', mb: 8 }}
                        >
                            <Typography variant="h1" fontWeight="bold" gutterBottom>
                                Welcome to 1Bank
                            </Typography>
                            <Typography variant="h4" color="text.secondary">
                                Reliable. Agile. Forward-thinking.
                            </Typography>
                        </Box>

                        <MotionButton
                            animate={bounceAnimation}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleLoginScroll}
                            sx={{
                                py: 2.5,
                                px: 7,
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                borderRadius: '40px',
                                textTransform: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.getContrastText(theme.palette.primary.main),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.dark,
                                    color: theme.palette.getContrastText(
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.dark
                                    ),
                                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Login to Dashboard
                        </MotionButton>
                    </Box>
                </Container>
            </MotionBox>

            <Box ref={scrollTargetRef} sx={{ height: '100vh' }} />
        </>
    );
};

export default Landing;