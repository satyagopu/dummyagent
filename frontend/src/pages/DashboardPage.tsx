import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import './DashboardPage.css';

export default function DashboardPage() {
    const { user, logout, fetchUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>AgentWeave Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                <div className="dashboard-content">
                    <div className="user-card">
                        <div className="user-avatar">
                            {user?.full_name?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h2>{user?.full_name || 'User'}</h2>
                            <p className="user-email">{user?.email}</p>
                            <p className="user-status">
                                Status: <span className="status-badge">{user?.is_active ? 'Active' : 'Inactive'}</span>
                            </p>
                            <p className="user-joined">
                                Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="welcome-card">
                        <h3>🎉 Welcome to AgentWeave!</h3>
                        <p>
                            You're all set up and ready to start building AI workflows.
                            Phase 2 authentication is complete!
                        </p>
                        <div className="features-list">
                            <div className="feature-item">✅ User Registration</div>
                            <div className="feature-item">✅ Secure Login</div>
                            <div className="feature-item">✅ JWT Authentication</div>
                            <div className="feature-item">✅ Protected Routes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
