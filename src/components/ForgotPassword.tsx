import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase, isAuthConfigured } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!isAuthConfigured()) {
        // Demo mode - simulate successful reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSent(true);
        return;
      }
      const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full flex items-center justify-center">
      <form onSubmit={submit} className="bg-gray-800/50 p-6 rounded-lg w-full max-w-sm space-y-4">
        <div className="text-white text-xl font-bold text-center">Forgot Password</div>
        {!isAuthConfigured() && (
          <div className="text-yellow-400 text-sm text-center bg-yellow-400/10 p-2 rounded">
            Demo mode - Auth not configured
          </div>
        )}
        <div className="flex items-center bg-gray-800 rounded px-3">
          <Mail size={16} className="text-gray-400" />
          <input className="bg-transparent flex-1 px-2 py-2 text-white outline-none" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {sent && <div className="text-green-400 text-sm">Reset link sent to your email.</div>}
        <button className="w-full bg-cyan-600 hover:bg-cyan-500 rounded py-2 text-white">Send reset link</button>
      </form>
    </div>
  );
}


