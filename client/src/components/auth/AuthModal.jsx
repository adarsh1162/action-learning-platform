import React, { useState } from 'react';
import useStore from '../../store/useStore';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
    const { setUser } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'Authentication failed');
            }

            if (!isLogin) {
                // If signup succeeded, automatically log in
                const loginRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const loginData = await loginRes.json();
                if (!loginRes.ok) throw new Error(loginData.message || 'Login after signup failed');
                
                localStorage.setItem('token', loginData.token);
                setUser(loginData.user);
            } else {
                localStorage.setItem('token', data.token);
                setUser(data.user);
            }

            onClose();
            // Optional: trigger a full page reload to fetch user data and skill graph natively
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <button className="auth-close" onClick={onClose}>×</button>
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-submit">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
