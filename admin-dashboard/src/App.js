// Admin Dashboard App
// Main entry point for admin web dashboard
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsLoggedIn(true);
            loadAnalytics();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/login`, loginData);
            localStorage.setItem('adminToken', response.data.data.token);
            setIsLoggedIn(true);
            loadAnalytics();
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
    };

    const loadAnalytics = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_BASE_URL}/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <div className="login-box">
                    <h1>StressBuster Admin</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    return (
        <div className="App">
            <header className="header">
                <h1>StressBuster Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="dashboard">
                {/* Overview Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Active Users</h3>
                        <p className="stat-value">{analytics?.overview?.total_active_users || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Today's Chat Queries</h3>
                        <p className="stat-value">{analytics?.overview?.today_chat_queries || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Confirmed Appointments</h3>
                        <p className="stat-value">{analytics?.overview?.confirmed_appointments || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Today's Game Sessions</h3>
                        <p className="stat-value">{analytics?.overview?.today_game_sessions || 0}</p>
                    </div>
                </div>

                {/* Chatbot Trends */}
                <div className="chart-container">
                    <h2>Chatbot Queries (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.chatbotTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Game Engagement */}
                <div className="chart-container">
                    <h2>Game Engagement (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.gameEngagement || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="game_type" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sessions" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Popular Resources */}
                <div className="table-container">
                    <h2>Popular Resources</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Views</th>
                                <th>Downloads</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.popularResources?.map((resource) => (
                                <tr key={resource.id}>
                                    <td>{resource.title}</td>
                                    <td>{resource.resource_type}</td>
                                    <td>{resource.view_count}</td>
                                    <td>{resource.download_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;
