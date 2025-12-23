'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp, Users, Building2, Clock, BarChart3 } from 'lucide-react';

interface AnalyticsOverview {
    totalViews: number;
    todayViews: number;
    weekViews: number;
    monthViews: number;
    uniqueVisitors: number;
    totalProperties: number;
}

interface TopProperty {
    id: string;
    title: string;
    location: string;
    images: string[];
    viewCount: number;
}

interface RecentView {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyLocation: string;
    viewedAt: string;
    visitorId: string | null;
}

interface AnalyticsData {
    overview: AnalyticsOverview;
    topProperties: TopProperty[];
    recentViews: RecentView[];
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/overview`, {
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const analyticsData = await res.json();
            setData(analyticsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[var(--marketing-green)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="text-center py-12 text-red-500">
                    <p>{error || 'Failed to load analytics'}</p>
                </div>
            </div>
        );
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-500">Total Views</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.overview.totalViews.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-sm text-gray-500">Today</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.overview.todayViews.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-sm text-gray-500">Unique Visitors</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.overview.uniqueVisitors.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-sm text-gray-500">Properties</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.overview.totalProperties}</p>
                </div>
            </div>

            {/* Weekly Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Properties */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-[var(--marketing-green)]" />
                        <h3 className="text-lg font-bold text-gray-900">Most Viewed Properties</h3>
                    </div>

                    {data.topProperties.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No property views yet</p>
                    ) : (
                        <div className="space-y-4">
                            {data.topProperties.map((property, index) => (
                                <div key={property.id} className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-gray-300 w-6">#{index + 1}</span>
                                    <div
                                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                        style={{ backgroundImage: `url(${property.images[0] || '/placeholder.jpg'})` }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{property.title}</p>
                                        <p className="text-sm text-gray-500 truncate">{property.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[var(--marketing-green)]">{property.viewCount}</p>
                                        <p className="text-xs text-gray-400">views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-[var(--marketing-green)]" />
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    </div>

                    {data.recentViews.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No recent activity</p>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {data.recentViews.map((view) => (
                                <div key={view.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-[var(--marketing-green)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Eye className="w-4 h-4 text-[var(--marketing-green)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 truncate">
                                            Viewed <span className="font-medium">{view.propertyTitle}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">{view.propertyLocation}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {formatTimeAgo(view.viewedAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Period Stats */}
            <div className="bg-[var(--marketing-green)] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">View Statistics</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-[var(--marketing-gold)]">{data.overview.todayViews}</p>
                        <p className="text-sm text-white/70">Today</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--marketing-gold)]">{data.overview.weekViews}</p>
                        <p className="text-sm text-white/70">This Week</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--marketing-gold)]">{data.overview.monthViews}</p>
                        <p className="text-sm text-white/70">This Month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
