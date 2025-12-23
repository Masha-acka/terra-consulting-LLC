'use client';

import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';


const values = [
    {
        icon: Target,
        title: 'Our Mission',
        description: 'To connect discerning buyers with exceptional properties across Kenya, providing unparalleled service and expertise in every transaction.'
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We maintain the highest standards in property verification, client service, and professional conduct in all our dealings.'
    },
    {
        icon: Heart,
        title: 'Client First',
        description: 'Your satisfaction is our priority. We listen, understand, and work tirelessly to find your perfect property match.'
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[var(--marketing-cream)] to-white pt-24">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-[var(--marketing-green)]/10 text-[var(--marketing-green)] text-sm font-medium rounded-full mb-6">
                            About Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-[var(--marketing-green)] mb-6 leading-tight">
                            Your Trusted Partner in
                            <span className="block text-[var(--marketing-gold)]">Kenyan Real Estate</span>
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
                            Since 2010, Terra Consulting LLC has been helping clients find their dream properties
                            across Kenya. From prime land in Karen to commercial spaces in Westlands,
                            we bring expertise, integrity, and personalized service to every transaction.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--marketing-green)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { value: '500+', label: 'Properties Sold' },
                            { value: '14+', label: 'Years Experience' },
                            { value: '1000+', label: 'Happy Clients' },
                            { value: '50+', label: 'Locations Covered' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-[var(--marketing-gold)] mb-2">{stat.value}</div>
                                <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[var(--marketing-green)] mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Our core values guide every interaction and decision we make.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-14 h-14 bg-[var(--marketing-green)]/10 rounded-xl flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-[var(--marketing-green)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[var(--marketing-green)] mb-6">
                        Ready to Find Your Dream Property?
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                        Let our experienced team guide you through Kenya's finest properties.
                        Contact us today for a personalized consultation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-4 bg-[var(--marketing-green)] text-white rounded-xl font-bold hover:bg-[var(--color-forest-light)] transition-all shadow-lg shadow-[var(--marketing-green)]/25"
                        >
                            Browse Properties
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white border-2 border-[var(--marketing-green)] text-[var(--marketing-green)] rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
