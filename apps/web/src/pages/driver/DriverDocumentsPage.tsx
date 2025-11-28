import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { Shield } from 'lucide-react';

export const DriverDocumentsPage: React.FC = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Verificación de Conductor</h1>
                        <p className="text-gray-600">Sube tus documentos para verificar tu cuenta</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <DocumentUpload
                        type="LICENSE"
                        label="Licencia de Conducir"
                    />
                    <DocumentUpload
                        type="PADRON"
                        label="Padrón del Vehículo"
                    />
                </div>
            </div>
        </Layout>
    );
};
