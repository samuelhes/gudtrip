import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    totalRides: number;
    totalBookings: number;
    totalRevenue: number;
    activeUsers: number;
    recentRides: number;
}

export const AdminDashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard General</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Usuarios</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.totalUsers}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Car className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Viajes Publicados</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.totalRides}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Reservas Totales</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.totalBookings}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Tokens Movidos</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.totalRevenue}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Usuarios Activos (Este Mes)</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.activeUsers}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Car className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Viajes Recientes (Últimos 7 días)</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.recentRides}</h3>
                </div>
            </div>
        </div>
    );
};
