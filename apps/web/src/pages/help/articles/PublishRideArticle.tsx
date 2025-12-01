import React from 'react';
import { Layout } from '../../../components/layout/Layout';

export const PublishRideArticle = () => {
    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Cómo publicar un viaje como conductor</h1>

                <div className="prose prose-blue max-w-none">
                    <p className="text-lg text-gray-600 mb-8">
                        Comparte tu auto y ahorra costos publicando tu viaje en Gudtrip. Es rápido y sencillo.
                    </p>

                    <div className="bg-green-50 p-6 rounded-xl mb-8">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Beneficios</h3>
                        <ul className="list-disc list-inside text-green-800 space-y-1">
                            <li>Recupera gastos de gasolina y peajes.</li>
                            <li>Conoce gente nueva.</li>
                            <li>Ayuda a reducir el tráfico y la contaminación.</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Paso a Paso</h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Ingresa a "Publicar Viaje"</h3>
                                <p className="text-gray-600">
                                    Haz clic en el botón "Publicar Viaje" en la barra de navegación o en el pie de página.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Define tu ruta</h3>
                                <p className="text-gray-600">
                                    Ingresa el origen, destino y puntos intermedios si los tienes. Define la fecha y hora de salida.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Configura los detalles</h3>
                                <p className="text-gray-600">
                                    Establece el número de asientos disponibles y el precio por asiento en Tokens.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Gestiona tus solicitudes</h3>
                                <p className="text-gray-600">
                                    Una vez publicado, recibirás notificaciones cuando alguien quiera viajar contigo.
                                    <br />
                                    Ve a tu bandeja de <strong>Notificaciones</strong> para <strong>Aceptar</strong> o <strong>Rechazar</strong> las solicitudes.
                                    <br />
                                    <em>¡Solo recibirás el pago si aceptas la solicitud!</em>
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Importante: Ciclo del Viaje</h2>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-yellow-700">
                            Para recibir tus tokens, debes marcar el viaje como <strong>INICIADO</strong> al salir y <strong>COMPLETADO</strong> al llegar a destino.
                            El sistema liberará los fondos a tu billetera automáticamente al completar el viaje.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
