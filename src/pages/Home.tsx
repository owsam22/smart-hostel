import React, { useState } from 'react';
import {
  Building2,
  ClipboardList,
  Bell,
  Search,
  Loader2,
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';


import LoginForm from '@/components/LoginForm';

type BackendState = 'idle' | 'warming' | 'ready' | 'failed';

const Home: React.FC = () => {
  const [backendState, setBackendState] = useState<BackendState>('idle');
  const [showLogin, setShowLogin] = useState(false);

  const API = 'http://localhost:5000/api';

  const checkBackend = async () => {
    setBackendState('warming');
    try {
      const res = await fetch(`${API}/health`);
      if (!res.ok) throw new Error();
      setBackendState('ready');
      setShowLogin(true);
    } catch {
      setBackendState('failed');
    }
  };

  const handleLoginClick = () => {
    backendState === 'ready' ? setShowLogin(true) : checkBackend();
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-gray-800">
      {/* HERO */}
      <section className="relative">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Hostel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 grid md:grid-cols-2 gap-14 items-center text-white">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 />
              </div>
              <span className="text-lg font-semibold">
                Smart Hostel Manager
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Bring order to <br /> everyday hostel life
            </h1>

            <p className="text-white/90 max-w-md mb-8">
              From broken lights to important notices — manage everything
              students and wardens deal with, in one clean system.
            </p>

            <button
              onClick={handleLoginClick}
              className="rounded-lg bg-[#e8c07d] px-7 py-3 font-semibold text-gray-900 hover:bg-[#ddb566]"
            >
              Login to Dashboard
            </button>

            {backendState === 'warming' && (
              <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
                <Loader2 className="animate-spin" size={16} />
                Waking up hostel servers…
              </div>
            )}

            {backendState === 'failed' && (
              <p className="mt-5 text-sm text-yellow-200">
                Backend is slow. Try again shortly.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Step
            icon={<ClipboardList />}
            title="Raise an Issue"
            desc="Students report problems with photos and details."
          />
          <Step
            icon={<Bell />}
            title="Get Updates"
            desc="Wardens update status and publish announcements."
          />
          <Step
            icon={<Search />}
            title="Track Everything"
            desc="Lost items, complaints, and resolutions — all searchable."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <img
            src="https://i.pinimg.com/1200x/8c/6f/a2/8c6fa204c303f39f72971185ed251dac.jpg"
            alt="Students hostel"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Built for real hostel problems
            </h2>

            <ul className="space-y-4 text-gray-700">
              <li>✔ Role-based access (Student / Admin)</li>
              <li>✔ Issue tracking with analytics</li>
              <li>✔ Announcements & notices</li>
              <li>✔ Lost & Found management</li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={18} /> Secure JWT authentication
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TRUST / FOOTER CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Less chaos. More clarity.
        </h2>
        <p className="text-gray-600 mb-8">
          Designed for students, wardens, and management — not just admins.
        </p>

        <button
          onClick={handleLoginClick}
          className="rounded-lg bg-gray-900 px-8 py-3 text-white font-semibold hover:bg-gray-800"
        >
          Get Started
        </button>
      </section>

      {/* LOGIN MODAL */}
{showLogin && backendState === 'ready' && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
    <LoginForm onClose={() => setShowLogin(false)} />
  </div>
)}
{/* FOOTER */}
<footer className="bg-gray-900 text-gray-300">
  <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">

    {/* Brand */}
    <div>
      <div className="flex items-center gap-2 text-white mb-4">
        <Building2 />
        <span className="font-semibold text-lg">Smart Hostel Manager</span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">
        A modern platform to manage hostel issues, notices, and communication
        between students and administration — without chaos.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-white font-semibold mb-4">Quick Links</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="#" className="hover:text-white">Home</a></li>
        <li><a href="#" className="hover:text-white">Dashboard</a></li>
        <li><a href="#" className="hover:text-white">Report Issue</a></li>
        <li><a href="#" className="hover:text-white">Announcements</a></li>
      </ul>
    </div>

    {/* Features */}
    <div>
      <h4 className="text-white font-semibold mb-4">Features</h4>
      <ul className="space-y-2 text-sm">
        <li>Issue Tracking</li>
        <li>Lost & Found</li>
        <li>Role-based Access</li>
        <li>Secure Authentication</li>
      </ul>
    </div>

    {/* Social */}
    <div>
      <h4 className="text-white font-semibold mb-4">Connect</h4>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/owsam22"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
        >
          <Github />
        </a>
        <a
          href="https://linkedin.com/in/samarpan22"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
        >
          <Linkedin />
        </a>
        <a
          href="mailto:samarpan.wors@gmail.com"
          className="hover:text-white"
        >
          <Mail />
        </a>
      </div>
    </div>
  </div>

  <div className="border-t border-gray-800">
    <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Smart Hostel Manager By Sam.
    </div>
  </div>
</footer>


    </div>
  );
};

export default Home;

/* --------- SMALL COMPONENT --------- */
const Step = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
    <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#f1ede6] flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);
