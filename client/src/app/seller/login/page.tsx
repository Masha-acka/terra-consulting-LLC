'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SellerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            // Allow Agents too if we had them, OR check for Seller/Agent
            if (data.user.role !== 'SELLER' && data.user.role !== 'AGENT') throw new Error('Unauthorized area');

            login(data.user, data.token);
            router.push('/seller/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--forest-green)] flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-white/20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-[var(--forest-green)] font-playfair">Seller Portal</h2>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider">Property Management</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="agent@company.com" />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl text-lg font-medium shadow-lg shadow-[var(--forest-green)]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</> : 'Access Dashboard'}
                    </button>
                </form>
                <div className="text-center mt-8 text-sm text-gray-500 space-y-3">
                    <p>Interested in selling? <Link href="/seller/register" className="text-[var(--forest-green)] font-semibold hover:underline">Apply to be a Partner</Link></p>
                    <div className="border-t border-gray-100 pt-4">
                        <Link href="/login/buyer" className="text-gray-400 hover:text-[var(--forest-green)] text-xs">← Back to Buyer Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

