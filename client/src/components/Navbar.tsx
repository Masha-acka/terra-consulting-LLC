'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Home, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
                    ? 'bg-white/95 backdrop-blur-md border-gray-100 py-3 shadow-sm'
                    : 'bg-white/80 backdrop-blur-sm border-gray-100/50 py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--marketing-green)] flex items-center justify-center shadow-md">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-playfair tracking-tight text-[var(--marketing-green)]">
                            Terra Consulting
                        </h1>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6 text-sm font-medium tracking-wide border-r border-gray-200 pr-6">
                        <Link
                            href="/"
                            className={`hover:text-[var(--marketing-gold)] transition-colors ${pathname === '/' ? 'text-[var(--marketing-gold)]' : 'text-[var(--text-primary)]'
                                }`}
                        >
                            All Listings
                        </Link>
                        <Link
                            href="/about"
                            className={`hover:text-[var(--marketing-gold)] transition-colors ${pathname === '/about' ? 'text-[var(--marketing-gold)]' : 'text-[var(--text-primary)]'
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className={`hover:text-[var(--marketing-gold)] transition-colors ${pathname === '/contact' ? 'text-[var(--marketing-gold)]' : 'text-[var(--text-primary)]'
                                }`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium flex items-center gap-2 text-[var(--marketing-green)]">
                                    <User className="w-4 h-4" />
                                    {user.name?.split(' ')[0]}
                                </span>

                                {user.role === 'ADMIN' && (
                                    <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--marketing-gold)] hover:text-[var(--marketing-gold)] flex items-center gap-1">
                                        <LayoutDashboard className="w-4 h-4" />
                                    </Link>
                                )}
                                {(user.role === 'SELLER' || user.role === 'AGENT') && (
                                    <Link href="/seller/dashboard" className="text-sm font-medium text-[var(--marketing-gold)] hover:text-[var(--marketing-gold)] flex items-center gap-1">
                                        <LayoutDashboard className="w-4 h-4" />
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login/buyer"
                                    className="text-sm font-medium text-[var(--marketing-green)] hover:text-[var(--marketing-gold)] transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register/buyer"
                                    className="px-5 py-2 text-sm font-medium uppercase tracking-wider bg-[var(--marketing-green)] text-white rounded-lg hover:bg-[var(--color-forest-light)] transition-all shadow-sm hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-[var(--text-primary)]" />
                    ) : (
                        <Menu className="w-6 h-6 text-[var(--text-primary)]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 px-6 animate-fade-in">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-lg font-playfair text-[var(--marketing-green)]" onClick={() => setMobileMenuOpen(false)}>All Listings</Link>
                        <Link href="/about" className="text-lg font-playfair text-[var(--marketing-green)]" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                        <Link href="/contact" className="text-lg font-playfair text-[var(--marketing-green)]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <hr className="border-gray-100 my-2" />
                        {!isAuthenticated && (
                            <>
                                <Link href="/login/buyer" className="text-[var(--text-secondary)]" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link href="/register/buyer" className="text-[var(--marketing-green)] font-semibold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 text-left">Logout</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
