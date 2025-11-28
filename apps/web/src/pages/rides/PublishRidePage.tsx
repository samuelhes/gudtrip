import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { CitySelector } from '../../components/common/CitySelector';

export const PublishRidePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departure_time: '',
        total_seats: 4,
        price_tokens: 10
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/rides', {
                ...formData,
                available_seats: formData.total_seats
            });
            alert('¡Viaje publicado exitosamente!');
            navigate('/');
        } catch (error) {
            console.error('Error publishing ride:', error);
            alert('Error al publicar el viaje');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Publicar Viaje</h2>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
                    <div>
                        <CitySelector
                            value={formData.origin}
                            onChange={(value) => setFormData({ ...formData, origin: value })}
                            placeholder="Ej: Santiago"
                            label="Origen"
                        />
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
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Fecha y Hora de Salida
                        </label>
                        <input
                            type="datetime-local"
                            required
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Publicando...' : 'Publicar Viaje'}
                    </button>
                </form>
            </div>
        </div>
    );
};
