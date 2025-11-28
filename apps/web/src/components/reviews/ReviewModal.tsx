import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import api from '../../services/api';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    rideId: string;
    revieweeId: string;
    revieweeName: string;
}

export const ReviewModal = ({ isOpen, onClose, rideId, revieweeId, revieweeName }: ReviewModalProps) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/reviews', {
                ride_id: rideId,
                reviewee_id: revieweeId,
                rating,
                comment,
            });
            alert('¡Gracias por tu calificación!');
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error al enviar la calificación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Calificar Viaje</h3>
                <p className="text-gray-500 mb-6">¿Cómo estuvo tu viaje con {revieweeName}?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (Opcional)</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Escribe tu experiencia..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar Calificación'}
                    </button>
                </form>
            </div>
        </div>
    );
};
