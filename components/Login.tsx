
import React, { useState } from 'react';
import { Theme } from '../types';

interface LoginProps {
  onLogin: () => void;
  theme: Theme;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      // Simulate successful login
      onLogin();
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center mb-4">
          <img 
            src={theme === 'dark' ? 'https://i.imgur.com/M3mmwBK.png' : 'https://i.imgur.com/zC7l7YH.png'} 
            alt="FaceWriter Logo" 
            className="h-12 w-auto" 
          />
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to continue</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
              required
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
