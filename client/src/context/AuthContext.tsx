'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User, token?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        async function checkAuth() {
            try {
                // Get token from storage
                const token = localStorage.getItem('terra_token');
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // First check API
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    headers,
                    cache: 'no-store',
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    const userData = data.user || data; // Handle wrapped or unwrapped response
                    setUser(userData);
                    // Update local storage to keep in sync
                    localStorage.setItem('terra_user', JSON.stringify(userData));
                } else {
                    // Token invalid or expired
                    localStorage.removeItem('terra_user');
                    localStorage.removeItem('terra_token');
                    setUser(null);
                }
            } catch (error) {
                console.warn('Auth check failed (likely network error or server down), falling back to local storage.');
                // Checking localStorage for persisted user as fallback
                const stored = localStorage.getItem('terra_user');
                if (stored) {
                    setUser(JSON.parse(stored));
                }
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, []);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        localStorage.setItem('terra_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('terra_token', token);
        }

        // Redirect based on role
        if (userData.role === 'BUYER') {
            router.push('/');
        } else if (userData.role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else {
            router.push('/seller/dashboard');
        }
    };

    const logout = async () => {
        // Clear user state immediately
        setUser(null);
        localStorage.removeItem('terra_user');
        localStorage.removeItem('terra_token');

        try {
            // Call API to clear cookie
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout API error:', error);
        }

        // Show success toast
        toast.success('Logged out successfully!');

        // Use hard redirect to clear any cached state
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
