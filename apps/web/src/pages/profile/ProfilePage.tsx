import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, CheckCircle, AlertCircle, Car } from 'lucide-react';

export const ProfilePage = () => {
    const { user } = useAuth();
    const [requestingDriver, setRequestingDriver] = useState(false);

    if (!user) return null;

    const isDriver = user.roles.includes('DRIVER');

    const handleRequestDriver = () => {
        setRequestingDriver(true);
        // Simulate API call
        setTimeout(() => {
            alert('Solicitud enviada. Te notificaremos cuando tu perfil sea verificado.');
            setRequestingDriver(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border p-8 flex items-center gap-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                        {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex gap-2 mt-3">
                            {user.roles.map((role) => (
                                <span key={role} className={`px-3 py-1 rounded-full text-xs font-bold ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        role === 'DRIVER' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {role === 'DRIVER' ? 'CONDUCTOR' : role === 'PASSENGER' ? 'PASAJERO' : role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Verifications */}
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gray-500" />
                        Verificaciones
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-gray-700">Correo Electrónico</span>
                            </div>
                            <span className="text-sm text-green-600 font-bold">Verificado</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                {isDriver ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                )}
                                <span className="font-medium text-gray-700">Licencia de Conducir</span>
                            </div>
                            <span className={`text-sm font-bold ${isDriver ? 'text-green-600' : 'text-yellow-600'}`}>
                                {isDriver ? 'Verificado' : 'Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Driver Mode */}
                {!isDriver && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Car className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">¿Quieres ser conductor?</h3>
                                <p className="text-blue-100">Publica viajes y comparte gastos con otros pasajeros.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleRequestDriver}
                            disabled={requestingDriver}
                            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                        >
                            {requestingDriver ? 'Enviando solicitud...' : 'Solicitar ser Conductor'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
