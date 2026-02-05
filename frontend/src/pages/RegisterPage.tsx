import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import './LoginPage.css';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await register(email, password, fullName || undefined);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by the store
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join AgentWeave and start building</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name (Optional)</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                disabled={isLoading}
                            />
                            <small style={{ color: '#718096', fontSize: '12px' }}>
                                Minimum 8 characters
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
