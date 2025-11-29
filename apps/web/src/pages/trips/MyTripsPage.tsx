import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Car, MapPin, Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { ReviewModal } from '../../components/reviews/ReviewModal';

interface Booking {
    id: string;
    seats_booked: number;
    total_price: number;
    status: string;
    ride: {
        id: string;
        origin: string;
        destination: string;
        departure_time: string;
        driver: {
            id: string;
            first_name: string;
            last_name: string;
        };
    };
}

export const MyTripsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedRide, setSelectedRide] = useState<{ rideId: string; driverId: string; driverName: string } | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleOpenReview = (rideId: string, driverId: string, driverName: string) => {
        setSelectedRide({ rideId, driverId, driverName });
        setReviewModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Mis Viajes</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No tienes viajes reservados</h3>
                        <p className="text-gray-500 mt-2">¡Busca un viaje y comienza tu aventura!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-xl">
                                                <Car className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.ride.departure_time).toLocaleDateString()}
                                                    <Clock className="w-4 h-4 ml-2" />
                                                    {new Date(booking.ride.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {booking.status === 'APPROVED' ? 'Confirmado' : booking.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                                                <DollarSign className="w-5 h-5" />
                                                {booking.total_price}
                                            </p>
                                            <p className="text-sm text-gray-500">{booking.seats_booked} asiento(s)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Origen</p>
                                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                {booking.ride.origin}
                                            </p>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Destino</p>
                                            <p className="font-medium text-gray-900 flex items-center gap-2 justify-end">
                                                <MapPin className="w-4 h-4 text-red-600" />
                                                {booking.ride.destination}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                                {booking.ride.driver.first_name[0]}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Conductor: <span className="font-medium text-gray-900">{booking.ride.driver.first_name} {booking.ride.driver.last_name}</span>
                                            </span>
                                        </div>

                                        {booking.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleOpenReview(booking.ride.id, booking.ride.driver.id, booking.ride.driver.first_name)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Star className="w-4 h-4" />
                                                Calificar Conductor
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRide && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    rideId={selectedRide.rideId}
                    revieweeId={selectedRide.driverId}
                    revieweeName={selectedRide.driverName}
                />
            )}
        </div>
    );
};
