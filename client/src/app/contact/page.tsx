'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Message sent! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    const handleWhatsApp = () => {
        const phoneNumber = '+254700000000';
        const message = 'Hello! I am interested in learning more about Terra Consulting properties.';
        window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['Westlands Business Park', 'Waiyaki Way, Nairobi', 'Kenya']
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+254 700 000 000', '+254 711 111 111']
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['info@terraconsulting.co.ke', 'sales@terraconsulting.co.ke']
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM', 'Sun: Closed']
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-[var(--marketing-cream)] to-white pt-24">
            {/* Hero Section */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-[var(--marketing-green)]/10 text-[var(--marketing-green)] text-sm font-medium rounded-full mb-6">
                            Contact Us
                        </span>
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[var(--marketing-green)] mb-6 leading-tight">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Have questions about a property or need expert advice? Our team is here to help you
                            every step of the way.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={info.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-[var(--marketing-green)]/10 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-[var(--marketing-green)]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-[var(--text-secondary)] text-sm">{detail}</p>
                                    ))}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & WhatsApp */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <h2 className="text-2xl font-playfair font-bold text-[var(--marketing-green)] mb-6">
                                Send Us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all"
                                            placeholder="+254 700 000 000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="property-inquiry">Property Inquiry</option>
                                            <option value="schedule-viewing">Schedule a Viewing</option>
                                            <option value="sell-property">Sell My Property</option>
                                            <option value="general">General Inquiry</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--marketing-green)] text-white rounded-xl font-bold hover:bg-[var(--color-forest-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Quick Contact */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8"
                        >
                            {/* WhatsApp CTA */}
                            <div className="bg-[#25D366] p-8 rounded-2xl text-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Prefer WhatsApp?</h3>
                                        <p className="text-white/90 mb-4">
                                            Get instant responses from our team. Chat with us directly on WhatsApp for quick property inquiries.
                                        </p>
                                        <button
                                            onClick={handleWhatsApp}
                                            className="px-6 py-3 bg-white text-[#25D366] rounded-xl font-bold hover:bg-gray-100 transition-all"
                                        >
                                            Start Chat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Preview */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-playfair font-bold text-[var(--marketing-green)] mb-6">
                                    Frequently Asked Questions
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { q: 'How do I schedule a property viewing?', a: 'Contact us via WhatsApp or the form above, and we\'ll arrange a convenient time.' },
                                        { q: 'Do you help with property financing?', a: 'Yes, we partner with leading banks to offer competitive mortgage rates.' },
                                        { q: 'What areas do you cover?', a: 'We specialize in Nairobi, Mombasa, Nakuru, and surrounding regions.' },
                                    ].map((faq, i) => (
                                        <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <h4 className="font-medium text-gray-900 mb-1">{faq.q}</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Office Image */}
                            <div
                                className="h-48 rounded-2xl bg-cover bg-center"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop)' }}
                            >
                                <div className="w-full h-full bg-black/40 rounded-2xl flex items-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold">Our Nairobi Office</p>
                                        <p className="text-sm text-white/80">Westlands Business Park</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
