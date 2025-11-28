import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Car, Users, MapPin, Calendar, Trash2, XCircle, Filter } from 'lucide-react';

interface Ride {
    id: string;
    origin: string;
    destination: string;
    meeting_point: string;
    final_point: string;
    departure_time: string;
    available_seats: number;
    total_seats: number;
    price_tokens: number;
    status: string;
    driver: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    created_at: string;
}

export const AdminRidesPage = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; ride: Ride | null }>({ show: false, ride: null });
    const [cancelModal, setCancelModal] = useState<{ show: boolean; ride: Ride | null }>({ show: false, ride: null });

    const fetchRides = async () => {
        try {
            const response = await api.get('/admin/rides');
            setRides(response.data);
        } catch (error) {
            console.error('Error fetching rides:', error);
            alert('Error al cargar viajes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/admin/rides/${id}`);
            alert('Viaje eliminado exitosamente');
            setDeleteModal({ show: false, ride: null });
            fetchRides();
        } catch (error) {
            console.error('Error deleting ride:', error);
            alert('Error al eliminar viaje');
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await api.patch(`/admin/rides/${id}/status`, { status: 'CANCELLED' });
            alert('Viaje cancelado exitosamente');
            setCancelModal({ show: false, ride: null });
            fetchRides();
        } catch (error) {
            console.error('Error cancelling ride:', error);
            alert('Error al cancelar viaje');
        }
    };

    const filteredRides = filter === 'ALL'
        ? rides
        : rides.filter(ride => ride.status === filter);

    const getStatusBadge = (status: string) => {
        const styles = {
            OPEN: 'bg-green-100 text-green-700',
            FULL: 'bg-yellow-100 text-yellow-700',
            COMPLETED: 'bg-blue-100 text-blue-700',
            CANCELLED: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Viajes</h2>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="ALL">Todos</option>
                        <option value="OPEN">Abiertos</option>
                        <option value="FULL">Completos</option>
                        <option value="COMPLETED">Completados</option>
                        <option value="CANCELLED">Cancelados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Conductor</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ruta</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha/Hora</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cupos</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRides.map((ride) => (
                            <tr key={ride.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {ride.driver.first_name?.[0] || ride.driver.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{ride.driver.first_name} {ride.driver.last_name}</p>
                                            <p className="text-sm text-gray-500">{ride.driver.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium">{ride.origin} → {ride.destination}</span>
                                        </div>
                                        {ride.meeting_point && (
                                            <p className="text-xs text-gray-500">📍 {ride.meeting_point}</p>
                                        )}
                                        {ride.final_point && (
                                            <p className="text-xs text-gray-500">🏁 {ride.final_point}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(ride.departure_time).toLocaleString('es-CL', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium">
                                            {ride.total_seats - ride.available_seats}/{ride.total_seats}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusBadge(ride.status)}`}>
                                        {ride.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {ride.status === 'OPEN' && (
                                            <button
                                                onClick={() => setCancelModal({ show: true, ride })}
                                                className="text-yellow-600 hover:text-yellow-700 transition-colors p-2 hover:bg-yellow-50 rounded-lg"
                                                title="Cancelar viaje"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteModal({ show: true, ride })}
                                            className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                            title="Eliminar viaje"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRides.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay viajes {filter !== 'ALL' && 'con este filtro'}</p>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.show && deleteModal.ride && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <Trash2 className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Eliminar Viaje</h3>
                        </div>
                        <p className="text-gray-600">
                            ¿Estás seguro de que deseas eliminar este viaje de <strong>{deleteModal.ride.origin}</strong> a <strong>{deleteModal.ride.destination}</strong>?
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                            ⚠️ Esta acción no se puede deshacer
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, ride: null })}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.ride!.id)}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal.show && cancelModal.ride && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center gap-3 text-yellow-600">
                            <XCircle className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Cancelar Viaje</h3>
                        </div>
                        <p className="text-gray-600">
                            ¿Estás seguro de que deseas cancelar este viaje de <strong>{cancelModal.ride.origin}</strong> a <strong>{cancelModal.ride.destination}</strong>?
                        </p>
                        <p className="text-sm text-gray-500">
                            El viaje será marcado como CANCELADO
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelModal({ show: false, ride: null })}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                            >
                                No, volver
                            </button>
                            <button
                                onClick={() => handleCancel(cancelModal.ride!.id)}
                                className="flex-1 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
