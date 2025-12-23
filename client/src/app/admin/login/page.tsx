'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (data.user.role !== 'ADMIN') throw new Error('Access Denied');

            login(data.user);
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"> {/* Dark background for admin */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 font-playfair">Admin Portal</h2>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider">Restricted Access</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Admin Email</label>
                        <div className="relative">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white hover:bg-black py-3.5 rounded-xl text-lg font-medium shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : 'Authenticate'}
                    </button>
                </form>
                <div className="text-center mt-8 text-sm">
                    <Link href="/" className="text-gray-400 hover:text-gray-900 text-xs">← Return to Site</Link>
                </div>
            </div>
        </div>);
}
