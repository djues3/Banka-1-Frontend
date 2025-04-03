import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import AccountCard from "./AccountSliderCardComponent";
import "../../styles/App.css";

import {
    Box,
    Typography,
    IconButton,
    Stack,
    Container,
    Paper,
} from "@mui/material";

const CardSection = ({ accounts, onSelectAccount, user })  => {

    const swiperRef = useRef(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);


    useEffect(() => {
        const revealButtons = document.querySelectorAll(".sl--card-nav-container");

        const handleClick = (e) => {
            const btn = e.currentTarget;
            const parent = btn.closest(".swiper-slide");
            const allSlides = document.querySelectorAll(".swiper-slide");

            allSlides.forEach((slide) => {
                if (slide !== parent) {
                    slide.querySelector(".sl--content-container")?.classList.remove("sl--card-reveal");
                    slide.querySelector(".sl--content-container")?.classList.add("sl--card-hide");
                    slide.querySelector(".sl--content-wrapper")?.classList.remove("sl--content-wrapper-active");
                    slide.querySelector(".sl--content-wrapper")?.classList.add("sl--content-wrapper-inactive");
                    slide.querySelector(".card-nav-gfx")?.classList.remove("sl--close-card-info");
                    slide.querySelector(".card-nav-gfx")?.classList.add("sl--show-card-info");
                }
            });

            parent.querySelector(".sl--content-container")?.classList.toggle("sl--card-hide");
            parent.querySelector(".sl--content-container")?.classList.toggle("sl--card-reveal");
            parent.querySelector(".sl--content-wrapper")?.classList.toggle("sl--content-wrapper-inactive");
            parent.querySelector(".sl--content-wrapper")?.classList.toggle("sl--content-wrapper-active");
            parent.querySelector(".card-nav-gfx")?.classList.toggle("sl--show-card-info");
            parent.querySelector(".card-nav-gfx")?.classList.toggle("sl--close-card-info");
        };

        revealButtons.forEach((btn) => btn.addEventListener("click", handleClick));

        if (selectedCardIndex != null && swiperRef.current) {
            if (swiperRef.current.realIndex !== selectedCardIndex) {
                swiperRef.current.slideTo(selectedCardIndex);
            }
        }

        return () => {
            revealButtons.forEach((btn) => btn.removeEventListener("click", handleClick));
        };
    }, [selectedCardIndex]);



    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 4, pb: 6, overflow: "visible" }}>
                <Stack direction="row" spacing={4}>
                    {/* Leva strana: Informacije o korisniku */}
                    <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                        <Box>
                            {user ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Hello,
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {user.firstName ? user.firstName : ""}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {user.lastName ? user.lastName : ""}
                                    </Typography>
                                    <Typography variant="body1" mt={2} maxWidth={500}>
                                        Welcome to Banka1 – your trusted digital bank. Here, you have quick and easy access to all your finances, anytime and anywhere.
                                        Track your account balance, make payments, and manage your money with ease and security.
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body1" color="text.secondary">Loading user info...</Typography>
                            )}

                        </Box>
                        {user ? (
                                <>
                            <Stack direction="row" spacing={2} mt={4}>
                                <IconButton className="custom-next">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 65 65"
                                        width="32"
                                        height="32"
                                        style={{fill: "#7256d6"}}
                                    >
                                        <path
                                            d="M0 32.5A32.5 32.5 0 1 0 32.5 0 32.5 32.5 0 0 0 0 32.5zm3 0A29.5 29.5 0 1 1 32.5 62 29.53 29.53 0 0 1 3 32.5zm32.6-12.9L22.7 32.5l12.9 12.9 2.12-2.12L26.94 32.5l10.78-10.78z"/>
                                    </svg>
                                </IconButton>
                                <IconButton className="custom-prev">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 65 65"
                                        width="32"
                                        height="32"
                                        style={{ fill: "#7256d6" }}
                                    >
                                        <path d="M32.5 0A32.5 32.5 0 1 0 65 32.5 32.5 32.5 0 0 0 32.5 0zm0 62A29.5 29.5 0 1 1 62 32.5 29.53 29.53 0 0 1 32.5 62zm-5.22-40.28L38.06 32.5 27.28 43.28l2.12 2.12 12.9-12.9-12.9-12.9z" />
                                    </svg>
                                </IconButton>
                            </Stack>
                            </> ) : (
                                <></>
                        )}

                    </Box>

                    {/* Desna strana: Swiper slider */}
                    <Box flex={2} maxWidth={700}>
                        {accounts.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                                <Typography variant="h6" color="text.secondary">
                                    No accounts available.
                                </Typography>
                            </Box>
                        ) : (
                            <Swiper
                                onSlideChange={(swiper) => {
                                    const newIndex = swiper.realIndex;
                                    setActiveSlideIndex(newIndex);
                                    setSelectedCardIndex(newIndex);
                                    onSelectAccount?.(accounts[newIndex]?.id);
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: ".custom-prev",
                                    prevEl: ".custom-next",
                                }}
                                slidesPerView={1.5}
                                centeredSlides={true}
                            >
                                {accounts.map((account, index) => (
                                    <SwiperSlide key={account.id} style={{ overflow: "visible" }}>
                                        <Box sx={{ p: 1 }}>
                                            <AccountCard
                                                account={account}
                                                isSelected={selectedCardIndex === index}
                                                onClick={() => {
                                                    setSelectedCardIndex(index);
                                                    swiperRef.current?.slideTo(index);
                                                    onSelectAccount?.(account.id);
                                                }}
                                            />
                                        </Box>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
};

export default CardSection;
