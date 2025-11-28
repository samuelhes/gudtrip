import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Car, MapPin, Users, DollarSign } from 'lucide-react';

interface Ride {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    available_seats: number;
    price_tokens: number;
    driver: {
        first_name: string;
        last_name: string;
    };
}

export const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                // In a real app, we would pass search params to the API
                const response = await api.get('/rides');
                setRides(response.data);
            } catch (error) {
                console.error('Error fetching rides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [searchParams]);

    const handleBookRide = async (rideId: string) => {
        if (!confirm('¿Estás seguro de que deseas reservar este viaje? Se descontarán los tokens de tu billetera.')) return;

        setBookingLoading(rideId);
        try {
            await api.post('/bookings', {
                ride_id: rideId,
                seats: 1, // Default to 1 seat for now
            });
            alert('¡Reserva exitosa!');
            navigate('/trips');
        } catch (error: any) {
            console.error('Error booking ride:', error);
            alert(error.response?.data?.message || 'Error al reservar el viaje. Verifica tu saldo.');
        } finally {
            setBookingLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Viajes disponibles</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : rides.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron viajes</h3>
                        <p className="text-gray-500 mt-2">Intenta cambiar los filtros de búsqueda</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rides.map((ride) => (
                            <div key={ride.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {new Date(ride.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="h-10 w-0.5 bg-gray-200 my-1"></div>
                                                <div className="text-sm font-bold text-gray-500">
                                                    {/* Calculate arrival time if available, otherwise hide */}
                                                    --:--
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-8">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-gray-900">{ride.origin}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-red-600" />
                                                    <span className="font-medium text-gray-900">{ride.destination}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{ride.driver.first_name} {ride.driver.last_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Car className="h-4 w-4" />
                                                <span>{ride.available_seats} asientos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between h-full pl-6 border-l ml-6">
                                        <div className="text-2xl font-bold text-blue-600 flex items-center">
                                            <DollarSign className="h-6 w-6" />
                                            {ride.price_tokens}
                                        </div>
                                        <button
                                            onClick={() => handleBookRide(ride.id)}
                                            disabled={bookingLoading === ride.id || ride.available_seats === 0}
                                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {bookingLoading === ride.id ? 'Reservando...' : 'Reservar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
