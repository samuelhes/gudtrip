import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ResponsiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'sm:max-w-md',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
                {/* Modal Content */}
                <div
                    className={`relative bg-white rounded-t-2xl sm:rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto modal-scroll shadow-xl transform transition-all`}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    {title && (
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
                                aria-label="Cerrar"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
