import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Car, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Ayuda Gudtrip</h1>
                    <p className="text-xl text-gray-600">Todo lo que necesitas saber para viajar seguro y feliz.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Passenger Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-primary-100 p-3 rounded-full mr-4">
                                <BookOpen className="w-8 h-8 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Para Pasajeros</h2>
                        </div>
                        <ul className="space-y-6">
                            <li className="border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-lg mb-2 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                    ¿Cómo buscar un viaje?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Ingresa tu origen, destino y fecha en la página de inicio. Verás una lista de conductores disponibles. Filtra por hora y precio para encontrar tu mejor opción.
                                </p>
                            </li>
                            <li className="border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-lg mb-2 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                                    ¿Cómo funcionan los pagos?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Recarga tu billetera virtual (Tokens) antes de reservar. Al reservar, los fondos se bloquean temporalmente. Solo se transfieren al conductor cuando este acepta tu solicitud.
                                </p>
                            </li>
                            <li>
                                <h3 className="font-semibold text-lg mb-2 flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-gray-400" />
                                    Viaja Seguro
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Todos nuestros conductores pasan por una verificación de documentos. Revisa sus calificaciones y reseñas antes de reservar.
                                </p>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link to="/help/request-ride" className="text-primary-600 font-semibold hover:text-primary-700">
                                Ver guía completa: Cómo solicitar un viaje &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Driver Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Car className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Para Conductores</h2>
                        </div>
                        <ul className="space-y-6">
                            <li className="border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-lg mb-2">1. Publicar un Viaje</h3>
                                <p className="text-gray-600 text-sm">
                                    Ve a "Publicar Viaje", define tu ruta, horario y precio por asiento. ¡Es gratis publicar!
                                </p>
                            </li>
                            <li className="border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-lg mb-2">2. Gestionar Reservas</h3>
                                <p className="text-gray-600 text-sm">
                                    Recibirás notificaciones cuando alguien quiera viajar contigo. Acepta o rechaza las solicitudes desde tu panel de "Mis Viajes".
                                </p>
                            </li>
                            <li>
                                <h3 className="font-semibold text-lg mb-2">3. Iniciar y Finalizar</h3>
                                <p className="text-gray-600 text-sm">
                                    <strong>Importante:</strong> Debes marcar el viaje como "Iniciado" al salir y "Finalizado" al llegar. Al finalizar, recibirás tus tokens automáticamente.
                                </p>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link to="/help/publish-ride" className="text-green-600 font-semibold hover:text-green-700">
                                Ver guía completa: Cómo publicar un viaje &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500">¿Aún tienes dudas? Contáctanos en <a href="mailto:soporte@gudtrip.com" className="text-primary-600 hover:underline">soporte@gudtrip.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
