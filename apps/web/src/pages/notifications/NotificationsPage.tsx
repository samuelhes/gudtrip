import React, { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { Layout } from '../../components/layout/Layout';
import { Bell, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: string;
    is_read: boolean;
    created_at: string;
    trip_id?: string;
    travel_need_id?: string;
}

export const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-primary-600" />
                        Notificaciones
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No tienes notificaciones</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white p-4 rounded-xl shadow-sm border transition-all ${notification.is_read ? 'border-gray-100 opacity-75' : 'border-primary-100 bg-primary-50/10'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className={`font-semibold text-lg mb-1 ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <p className="text-gray-600 mb-3">{notification.body}</p>

                                        {notification.type === 'TRIP_REQUEST' && !notification.is_read && (
                                            <div className="flex gap-3 mb-3">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.patch(`/bookings/${(notification as any).data.bookingId}/accept`);
                                                            alert('Solicitud aceptada');
                                                            markAsRead(notification.id);
                                                            fetchNotifications(); // Refresh to update UI
                                                        } catch (e: any) {
                                                            alert(e.response?.data?.message || 'Error al aceptar');
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.patch(`/bookings/${(notification as any).data.bookingId}/reject`);
                                                            alert('Solicitud rechazada');
                                                            markAsRead(notification.id);
                                                            fetchNotifications();
                                                        } catch (e: any) {
                                                            alert(e.response?.data?.message || 'Error al rechazar');
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {format(new Date(notification.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                            title="Marcar como leída"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
