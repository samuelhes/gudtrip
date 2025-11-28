import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface WhatsAppMessageGeneratorProps {
    origin: string;
    destination: string;
    meeting_point: string;
    final_point: string;
    departure_time: string;
    total_seats: number;
    price_tokens: number;
}

export const WhatsAppMessageGenerator = ({
    origin,
    destination,
    meeting_point,
    final_point,
    departure_time,
    total_seats,
    price_tokens
}: WhatsAppMessageGeneratorProps) => {
    const [copied, setCopied] = useState(false);

    const generateMessage = () => {
        if (!origin || !destination || !departure_time) return '';

        const date = new Date(departure_time);
        const formattedDate = date.toLocaleDateString('es-CL', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `🚗 gudtrip – Viaje disponible

Ruta: ${origin} → ${destination}
Fecha: ${formattedDate}
Hora: ${formattedTime}
Punto de encuentro: ${meeting_point || 'Por definir'}
Punto final: ${final_point || 'Por definir'}
Cupos disponibles: ${total_seats}
Valor por persona: ${price_tokens} tokens

Si te interesa, escríbeme o entra a gudtrip para reservar tu cupo 🙌`;
    };

    const message = generateMessage();

    const handleCopy = async () => {
        if (!message) return;

        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handleWhatsAppShare = () => {
        if (!message) return;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    if (!message) return null;

    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    Mensaje para compartir
                </h3>
            </div>

            <textarea
                readOnly
                value={message}
                className="w-full p-3 bg-white border border-green-300 rounded-lg text-sm font-mono resize-none"
                rows={11}
            />

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar mensaje'}
                </button>
                <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
                >
                    <span className="text-xl">📱</span>
                    Compartir en WhatsApp
                </button>
            </div>
        </div>
    );
};
