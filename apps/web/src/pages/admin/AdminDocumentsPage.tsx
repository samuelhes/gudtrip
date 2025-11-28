import React, { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { Button } from '../../components/ui/Button';
import { Check, X, ExternalLink } from 'lucide-react';

interface Document {
    id: string;
    type: string;
    front_image_url: string;
    back_image_url?: string;
    status: string;
    created_at: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export const AdminDocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents/pending');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
        try {
            await api.patch(`/documents/${id}/verify`, {
                status,
                rejectionReason,
            });
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Error verifying document:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Verificación de Documentos</h1>

            {loading ? (
                <div className="text-center py-8">Cargando...</div>
            ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay documentos pendientes de revisión.</div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {doc.user.first_name} {doc.user.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{doc.user.email}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                        {doc.type}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => {
                                            const reason = window.prompt('Razón de rechazo:');
                                            if (reason) handleVerify(doc.id, 'REJECTED', reason);
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Rechazar
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleVerify(doc.id, 'APPROVED')}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Aprobar
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Frente</p>
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={doc.front_image_url} alt="Frente" className="object-cover w-full h-full" />
                                        <a href={doc.front_image_url} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100">
                                            <ExternalLink className="w-4 h-4 text-gray-600" />
                                        </a>
                                    </div>
                                </div>
                                {doc.back_image_url && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Dorso</p>
                                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                            <img src={doc.back_image_url} alt="Dorso" className="object-cover w-full h-full" />
                                            <a href={doc.back_image_url} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100">
                                                <ExternalLink className="w-4 h-4 text-gray-600" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
