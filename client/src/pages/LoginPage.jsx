import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine, RiMailLine } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(identifier, password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setMessage(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080a10] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-black text-white">Login disabled</h1>
        <p className="mt-2 text-sm text-neutral-300">This page is kept for future auth integration.</p>

        <label className="mt-6 block text-sm text-neutral-300">Username or email</label>
        <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-black/25 px-3 text-white">
          <RiMailLine className="text-neutral-400" />
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="username"
          />
        </div>

        <label className="mt-4 block text-sm text-neutral-300">Password</label>
        <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-black/25 px-3 text-white">
          <RiLockPasswordLine className="text-neutral-400" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full bg-transparent text-sm outline-none"
            placeholder="password"
          />
        </div>

        {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
