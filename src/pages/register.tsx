import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const inputClass =
  'w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 ' +
  'focus:border-amber-600 focus:ring-2 focus:ring-amber-500 outline-none';

const buttonClass =
  'w-full rounded-lg bg-amber-600 py-3 font-semibold text-white ' +
  'hover:bg-amber-700 disabled:opacity-50 transition';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    hostel: '',
    block: '',
    room: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend NOT ready? This will fail gracefully
      const res = await fetch('https://smart-hostel-backend-rxm4.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.message ||
          'Backend not connected. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">

        {/* Close button */}
        <button
          onClick={() => navigate('/')}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        {/* Left Illustration / Info */}
        <div className="hidden md:flex flex-col justify-center bg-amber-50 p-10">
          <div className="flex items-center gap-2 text-amber-700">
            <Building2 />
            <span className="font-semibold">Hostel Portal</span>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-stone-800">
            Join your hostel community
          </h2>

          <p className="mt-4 text-stone-600 leading-relaxed">
            Create an account to report issues, track complaints,
            and stay connected with hostel management — all in one place.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-stone-500">
            <Home size={18} />
            <span>Designed for students & management</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold text-stone-800">
            Create account
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Register to access hostel services
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={inputClass}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <input
                name="hostel"
                placeholder="Hostel"
                value={form.hostel}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                name="block"
                placeholder="Block"
                value={form.block}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                name="room"
                placeholder="Room"
                value={form.room}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={buttonClass}
            >
              {isLoading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-amber-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
