import React, { useState } from 'react';
import { api } from '../../lib/axios';
import { Button } from '../ui/Button';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
    type: 'LICENSE' | 'PADRON';
    label: string;
    onUploadSuccess?: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ type, label, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            // In a real app, we would upload to S3/Cloudinary here and get a URL
            // For this MVP, we'll simulate upload by converting to base64 or just sending a fake URL
            // But the backend expects a URL.
            // Let's assume we have an upload endpoint or we just send the filename as URL for now.
            // Or better, let's implement a simple file upload endpoint in backend later.
            // For now, let's simulate a URL.
            const fakeUrl = `https://fake-storage.com/${file.name}`;

            await api.post('/documents/upload', {
                type,
                url: fakeUrl,
            });

            setSuccess(true);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error('Error uploading document:', err);
            setError('Error al subir el documento. Inténtalo de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{label}</h3>
                {success && <Check className="w-5 h-5 text-green-500" />}
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />
                <Button
                    variant="outline"
                    className="w-full"
                    isLoading={uploading}
                    type="button"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Subiendo...' : success ? 'Subir otro' : 'Seleccionar archivo'}
                </Button>
            </div>
        </div>
    );
};
