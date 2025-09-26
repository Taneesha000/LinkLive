import React, { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactSupport() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // simulate send
    setTimeout(() => setSent(true), 500);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full flex items-center justify-center">
      <form onSubmit={submit} className="bg-gray-800/50 p-6 rounded-lg w-full max-w-md space-y-4">
        <div className="text-white text-xl font-bold text-center">Contact Support</div>
        <div className="flex items-center bg-gray-800 rounded px-3">
          <Mail size={16} className="text-gray-400" />
          <input className="bg-transparent flex-1 px-2 py-2 text-white outline-none" placeholder="Your email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="flex items-start bg-gray-800 rounded px-3">
          <MessageSquare size={16} className="text-gray-400 mt-2" />
          <textarea className="bg-transparent flex-1 px-2 py-2 text-white outline-none min-h-[120px]" placeholder="How can we help?" value={message} onChange={e=>setMessage(e.target.value)} />
        </div>
        {sent && <div className="text-green-400 text-sm">Thanks! We will get back to you soon.</div>}
        <button className="w-full bg-cyan-600 hover:bg-cyan-500 rounded py-2 text-white">Send</button>
      </form>
    </div>
  );
}


