import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { supabase, isAuthConfigured } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';

export default function Signup({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useUser();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!isAuthConfigured()) {
        // Demo mode - simulate successful signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = {
          id: 'demo-user',
          name: name || email.split('@')[0] || 'Demo User',
          email: email
        };
        login(userData);
        onSuccess?.();
        return;
      }
      const { data, error } = await supabase!.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      
      const userData = {
        id: data.user?.id || 'user',
        name: name || email.split('@')[0] || 'User',
        email: email
      };
      login(userData);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full flex items-center justify-center">
      <form onSubmit={submit} className="bg-gray-800/50 p-6 rounded-lg w-full max-w-sm space-y-4">
        <div className="text-white text-xl font-bold text-center">Sign up</div>
        {!isAuthConfigured() && (
          <div className="text-yellow-400 text-sm text-center bg-yellow-400/10 p-2 rounded">
            Demo mode - Auth not configured
          </div>
        )}
        <div className="flex items-center bg-gray-800 rounded px-3">
          <User size={16} className="text-gray-400" />
          <input className="bg-transparent flex-1 px-2 py-2 text-white outline-none" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="flex items-center bg-gray-800 rounded px-3">
          <Mail size={16} className="text-gray-400" />
          <input className="bg-transparent flex-1 px-2 py-2 text-white outline-none" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="flex items-center bg-gray-800 rounded px-3">
          <Lock size={16} className="text-gray-400" />
          <input className="bg-transparent flex-1 px-2 py-2 text-white outline-none" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 rounded py-2 text-white">{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
    </div>
  );
}


