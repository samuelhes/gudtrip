import React, { useState } from 'react';
import { api } from '../../lib/axios';
import { Button } from '../ui/Button';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    revieweeId: string;
    rideId: string;
    revieweeName: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, revieweeId, rideId, revieweeName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await api.post('/reviews', {
                reviewee_id: revieweeId,
                ride_id: rideId,
                rating,
                comment,
            });
            onClose();
            // Optionally trigger a refresh or toast
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Calificar a {revieweeName}</h2>
                <p className="text-gray-600 mb-6">¿Cómo estuvo tu viaje? Tu opinión ayuda a la comunidad.</p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={3}
                    placeholder="Escribe un comentario (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    isLoading={loading}
                    disabled={rating === 0}
                >
                    Enviar Calificación
                </Button>
            </div>
        </div>
    );
};
