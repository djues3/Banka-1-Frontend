import React from 'react';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h1>Welcome to the Admin Dashboard</h1>
                <p>Please use the sidebar to navigate through different sections.</p>
            </div>
        </div>
    );
};

export default HomePage;