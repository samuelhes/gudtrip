import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Car, MapPin, Users, DollarSign, ArrowRight } from 'lucide-react';
import { ResponsiveModal } from '../../components/common/ResponsiveModal';

interface Ride {
    id: string;
    origin: string;
    destination: string;
    meeting_point: string;
    final_point: string;
    departure_time: string;
    available_seats: number;
    price_tokens: number;
    driver: {
        id: string;
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
    const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showFundsModal, setShowFundsModal] = useState(false);

    useEffect(() => {
        const fetchRides = async () => {
            try {
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

    const handleBookClick = (ride: Ride) => {
        setSelectedRide(ride);
        setShowConfirmModal(true);
    };

    const confirmBooking = async () => {
        if (!selectedRide) return;

        setBookingLoading(selectedRide.id);
        try {
            await api.post('/bookings', {
                ride_id: selectedRide.id,
                seats: 1,
            });
            setShowConfirmModal(false);
            alert('¡Solicitud enviada! Espera la confirmación del conductor 🚗');
            navigate('/trips');
        } catch (error: any) {
            console.error('Error booking ride:', error);
            setShowConfirmModal(false);

            if (error.response?.data?.message === 'Insufficient funds') {
                setShowFundsModal(true);
            } else {
                alert(error.response?.data?.message || 'Error al reservar el viaje.');
            }
        } finally {
            setBookingLoading(null);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
                            <div key={ride.id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-4 flex-1 w-full">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {new Date(ride.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="h-10 w-0.5 bg-gray-200 my-1"></div>
                                                <div className="text-sm font-bold text-gray-500">
                                                    --:--
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-8">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                            <span className="font-medium">{ride.origin}</span>
                                                            <ArrowRight className="hidden sm:block h-4 w-4 text-gray-400" />
                                                            <span className="font-medium">{ride.destination}</span>
                                                        </div>
                                                        {ride.meeting_point && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                📍 Punto de encuentro: {ride.meeting_point}
                                                            </p>
                                                        )}
                                                        {ride.final_point && (
                                                            <p className="text-sm text-gray-600">
                                                                🏁 Punto final: {ride.final_point}
                                                            </p>
                                                        )}
                                                    </div>
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

                                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between w-full gap-3 pt-4 border-t sm:w-auto sm:h-full sm:pl-6 sm:border-l sm:border-t-0 sm:ml-6 sm:pt-0">
                                        <div className="text-2xl font-bold text-blue-600 flex items-center">
                                            <DollarSign className="h-6 w-6" />
                                            {ride.price_tokens}
                                        </div>
                                        <button
                                            onClick={() => handleBookClick(ride)}
                                            disabled={bookingLoading === ride.id || ride.available_seats === 0}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-touch w-full xs:w-auto"
                                        >
                                            {bookingLoading === ride.id ? 'Solicitando...' : 'Solicitar Cupo'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Booking Modal */}
            <ResponsiveModal
                isOpen={showConfirmModal && !!selectedRide}
                onClose={() => setShowConfirmModal(false)}
                title="Solicitar Cupo"
                size="md"
            >
                {selectedRide && (
                    <div className="space-y-6">
                        <p className="text-gray-600">
                            Estás a punto de solicitar un asiento para el viaje de <b>{selectedRide.origin}</b> a <b>{selectedRide.destination}</b>.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-800 font-medium">Precio por asiento</span>
                                <span className="text-xl font-bold text-blue-600">{selectedRide.price_tokens} Tokens</span>
                            </div>
                            <p className="text-xs text-blue-600">
                                * Los tokens se descontarán de tu billetera solo cuando el conductor acepte tu solicitud.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 touch-manipulation min-h-touch"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmBooking}
                                disabled={!!bookingLoading}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 touch-manipulation min-h-touch"
                            >
                                {bookingLoading ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </div>
                )}
            </ResponsiveModal>

            {/* Insufficient Funds Modal */}
            <ResponsiveModal
                isOpen={showFundsModal}
                onClose={() => setShowFundsModal(false)}
                title="Saldo Insuficiente"
                size="md"
            >
                <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <DollarSign className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-gray-600">
                        No tienes suficientes tokens en tu billetera para realizar esta reserva.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowFundsModal(false)}
                            className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 touch-manipulation min-h-touch"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => navigate('/wallet')}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 touch-manipulation min-h-touch"
                        >
                            Recargar Billetera
                        </button>
                    </div>
                </div>
            </ResponsiveModal>
        </div>
    );
};
