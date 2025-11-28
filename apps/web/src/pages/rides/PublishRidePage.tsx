import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { CitySelector } from '../../components/common/CitySelector';
import { WhatsAppMessageGenerator } from '../../components/rides/WhatsAppMessageGenerator';

export const PublishRidePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        meeting_point: '',
        final_point: '',
        departure_time: '',
        total_seats: 4,
        price_tokens: 10
    });

    const [showModal, setShowModal] = useState(false);

    const validateForm = () => {
        const now = new Date();
        const selectedDate = new Date(formData.departure_time);

        if (selectedDate <= now) {
            alert('La fecha de salida debe ser en el futuro');
            return false;
        }

        if (formData.total_seats < 1) {
            alert('Debe haber al menos 1 asiento disponible');
            return false;
        }

        if (formData.price_tokens < 0) {
            alert('El precio no puede ser negativo');
            return false;
        }

        return true;
    };

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const handleConfirmPublish = async () => {
        setLoading(true);
        try {
            await api.post('/rides', {
                origin: formData.origin,
                destination: formData.destination,
                meeting_point: formData.meeting_point,
                final_point: formData.final_point,
                departure_time: formData.departure_time,
                available_seats: formData.total_seats,
                price_tokens: formData.price_tokens
            });
            alert('¡Viaje publicado exitosamente!');
            navigate('/');
        } catch (error: any) {
            console.error('Error publishing ride:', error);

            // Mensajes de error específicos según código de respuesta
            if (error.response?.status === 400 || error.response?.status === 422) {
                const message = error.response?.data?.message || 'Datos inválidos';
                alert(`Error de validación: ${message}`);
            } else if (error.response?.status === 401) {
                alert('Sesión expirada. Por favor inicia sesión nuevamente.');
                navigate('/login');
            } else if (error.response?.status === 403) {
                alert('No tienes permisos para realizar esta acción.');
            } else if (error.response?.status >= 500) {
                alert('Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
            } else {
                alert('Error al publicar el viaje. Verifica tu conexión e intenta nuevamente.');
            }
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Publicar Viaje</h2>

                <form onSubmit={handlePreSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
                    <div>
                        <CitySelector
                            value={formData.origin}
                            onChange={(value) => setFormData({ ...formData, origin: value })}
                            placeholder="Ej: Santiago"
                            label="Origen"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Punto de encuentro
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Metro Manquehue, Jumbo Maitencillo"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            value={formData.meeting_point}
                            onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Lugar específico donde recogerás a los pasajeros</p>
                    </div>

                    <div>
                        <CitySelector
                            value={formData.destination}
                            onChange={(value) => setFormData({ ...formData, destination: value })}
                            placeholder="Ej: Viña del Mar"
                            label="Destino"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Punto final
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Mall Marina Arauco, Terminal Santiago"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            value={formData.final_point}
                            onChange={(e) => setFormData({ ...formData, final_point: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Lugar específico donde dejarás a los pasajeros</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Fecha y Hora de Salida
                        </label>
                        <input
                            type="datetime-local"
                            required
                            step="300"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            value={formData.departure_time}
                            onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Asientos Disponibles
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                required
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                value={formData.total_seats}
                                onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="inline h-4 w-4 mr-1" />
                                Precio (Tokens/asiento)
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                value={formData.price_tokens}
                                onChange={(e) => setFormData({ ...formData, price_tokens: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Generador de mensaje WhatsApp */}
                    <WhatsAppMessageGenerator
                        origin={formData.origin}
                        destination={formData.destination}
                        meeting_point={formData.meeting_point}
                        final_point={formData.final_point}
                        departure_time={formData.departure_time}
                        total_seats={formData.total_seats}
                        price_tokens={formData.price_tokens}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </form>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Confirmar Viaje</h3>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ruta</span>
                                <span className="font-medium text-right">{formData.origin} ➝ {formData.destination}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Punto de encuentro</span>
                                <span className="font-medium text-right">{formData.meeting_point}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Punto final</span>
                                <span className="font-medium text-right">{formData.final_point}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Fecha</span>
                                <span className="font-medium text-right">
                                    {new Date(formData.departure_time).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Precio por asiento</span>
                                <span className="font-medium">{formData.price_tokens} Tokens</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Asientos</span>
                                <span className="font-medium">{formData.total_seats}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Ganancia Estimada</span>
                                <span className="text-xl font-bold text-green-600">
                                    {formData.price_tokens * formData.total_seats} Tokens
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmPublish}
                                disabled={loading}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Publicando...' : 'Confirmar y Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
