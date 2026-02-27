import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl bg-[#faf9f7] p-8 shadow-2xl border border-gray-200">
      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-200"
        >
          <X size={18} />
        </button>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Login to manage your hostel activities
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-800 focus:ring-2 focus:ring-gray-300 outline-none"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-gray-800 focus:ring-2 focus:ring-gray-300 outline-none"
        />

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {isLoading && <Loader2 className="animate-spin" size={18} />}
          {isLoading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      {/* DIVIDER */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="text-xs text-gray-500">NEW HERE?</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      {/* REGISTER */}
      <button
        onClick={() => navigate('/register')}
        className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-800 hover:bg-gray-100"
      >
        Create a new account
      </button>
    </div>
  );
};

export default LoginForm;
