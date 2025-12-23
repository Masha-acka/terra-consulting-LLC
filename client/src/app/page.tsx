'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import { Property, fetchProperties } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Search, SlidersHorizontal, X, Building2, Home, TreePine, ArrowRight } from 'lucide-react';

// Generate or get visitor ID for tracking
const getVisitorId = (): string => {
  if (typeof window === 'undefined') return '';
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Track property view
const trackPropertyView = async (propertyId: string, userId?: string) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId,
        visitorId: getVisitorId(),
        userId: userId || null
      })
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
};

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [props, saved] = await Promise.all([
          fetchProperties({
            category: filterCategory || undefined,
            status: filterStatus || undefined,
          }),
          user ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved`, { credentials: 'include' }).then(res => res.ok ? res.json() : []) : Promise.resolve([])
        ]);

        setProperties(props);
        if (Array.isArray(saved)) {
          setSavedIds(new Set(saved.map((p: Property) => p.id)));
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load properties. Please make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [filterCategory, filterStatus, user]);

  // Handle property selection with view tracking
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    trackPropertyView(property.id, user?.id);
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!user) {
      alert('Please login to save properties');
      return;
    }

    const isSaved = savedIds.has(propertyId);
    const newSaved = new Set(savedIds);
    if (isSaved) newSaved.delete(propertyId);
    else newSaved.add(propertyId);
    setSavedIds(newSaved);

    try {
      const method = isSaved ? 'DELETE' : 'POST';
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved/${propertyId}`, {
        method,
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to toggle save', error);
      setSavedIds(savedIds);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: '', label: 'All Properties', icon: Building2, count: properties.length },
    { id: 'LAND', label: 'Land', icon: TreePine, count: properties.filter(p => p.category === 'LAND').length },
    { id: 'HOUSE', label: 'Houses', icon: Home, count: properties.filter(p => p.category === 'HOUSE').length },
    { id: 'COMMERCIAL', label: 'Commercial', icon: Building2, count: properties.filter(p => p.category === 'COMMERCIAL').length },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--marketing-cream)] to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-[var(--marketing-green)]/10 text-[var(--marketing-green)] text-sm font-medium rounded-full mb-6">
              Premium Properties in Kenya
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-[var(--marketing-green)] mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-[var(--marketing-gold)]">Property Investment</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
              Discover exceptional land, homes, and commercial properties across Kenya.
              Your dream property awaits.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-100/50 text-base focus:outline-none focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${isActive
                    ? 'bg-[var(--marketing-green)] text-white shadow-lg shadow-[var(--marketing-green)]/25'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[var(--marketing-green)] hover:text-[var(--marketing-green)]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[var(--marketing-green)]'}`} />
                  {cat.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Status Filter */}
          <div className="flex justify-center mt-4 gap-2">
            {['', 'SALE', 'LEASE'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                  ? 'bg-[var(--marketing-gold)] text-[var(--marketing-green)]'
                  : 'text-gray-500 hover:text-[var(--marketing-green)]'
                  }`}
              >
                {status === '' ? 'All' : status === 'SALE' ? 'For Sale' : 'For Lease'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-[var(--marketing-green)]">
                {filterCategory ? categories.find(c => c.id === filterCategory)?.label : 'All Properties'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {isLoading ? 'Loading...' : `${filteredProperties.length} properties available`}
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[var(--marketing-green)] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                      <div className="h-10 bg-gray-100 rounded-lg flex-1 animate-pulse" />
                      <div className="h-10 bg-gray-100 rounded-lg flex-1 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3">Connection Error</h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--marketing-green)] text-white rounded-xl font-medium hover:bg-[var(--color-forest-light)] transition-colors"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3">No Properties Found</h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : 'Try adjusting your filters to see more properties.'}
              </p>
              {(searchQuery || filterCategory || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('');
                    setFilterStatus('');
                  }}
                  className="mt-6 text-[var(--marketing-green)] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <PropertyCard
                    property={property}
                    isFavorite={savedIds.has(property.id)}
                    onToggleFavorite={() => handleToggleFavorite(property.id)}
                    onClick={() => handlePropertySelect(property)}
                    isSelected={selectedProperty?.id === property.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProperty(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-4 md:inset-8 lg:inset-12 bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <PropertyDetail
                property={selectedProperty}
                onClose={() => setSelectedProperty(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
