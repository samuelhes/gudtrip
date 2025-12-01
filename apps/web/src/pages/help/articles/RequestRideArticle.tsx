import React from 'react';
import { Layout } from '../../../components/layout/Layout';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const RequestRideArticle = () => {
    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Cómo solicitar un viaje como pasajero</h1>

                <div className="prose prose-blue max-w-none">
                    <p className="text-lg text-gray-600 mb-8">
                        En Gudtrip, solicitar un viaje es fácil y seguro. Sigue estos pasos para unirte a un viaje y llegar a tu destino.
                    </p>

                    <div className="bg-blue-50 p-6 rounded-xl mb-8">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Requisitos Previos</h3>
                        <ul className="list-disc list-inside text-blue-800 space-y-1">
                            <li>Tener una cuenta activa en Gudtrip.</li>
                            <li>Haber iniciado sesión.</li>
                            <li>(Opcional) Tener saldo en tu billetera (necesario para que el conductor te acepte).</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Paso a Paso</h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Busca tu viaje</h3>
                                <p className="text-gray-600">
                                    Ingresa tu origen, destino y fecha en la página de inicio. Utiliza los filtros para encontrar el horario que más te convenga.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Solicita el cupo</h3>
                                <p className="text-gray-600">
                                    En la tarjeta del viaje, verás el botón <strong>"Solicitar Cupo"</strong>. Al pulsarlo, verás un resumen del precio.
                                </p>
                                <div className="bg-gray-100 p-4 rounded-lg mt-2 text-sm text-gray-500 italic">
                                    Nota: No se te cobrará nada en este momento. Los tokens solo se descuentan si el conductor acepta tu solicitud.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Espera la confirmación</h3>
                                <p className="text-gray-600">
                                    Tu solicitud quedará en estado <strong>PENDIENTE</strong>. El conductor recibirá una notificación y decidirá si aceptarte.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">¡Listo para viajar!</h3>
                                <p className="text-gray-600">
                                    Si el conductor acepta:
                                    <ul className="list-disc list-inside mt-2 ml-4">
                                        <li>Recibirás una notificación de confirmación.</li>
                                        <li>Se descontarán los tokens de tu billetera.</li>
                                        <li>Verás el viaje en "Mis Viajes" con estado <strong>CONFIRMADO</strong>.</li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Preguntas Frecuentes</h2>

                    <div className="space-y-4">
                        <details className="bg-white border rounded-lg p-4 cursor-pointer">
                            <summary className="font-semibold text-gray-900">¿Qué pasa si el conductor rechaza mi solicitud?</summary>
                            <p className="mt-2 text-gray-600">No te preocupes, no se te cobrará nada. Tu solicitud pasará a estado RECHAZADO y podrás buscar otro viaje.</p>
                        </details>
                        <details className="bg-white border rounded-lg p-4 cursor-pointer">
                            <summary className="font-semibold text-gray-900">¿Puedo cancelar mi solicitud?</summary>
                            <p className="mt-2 text-gray-600">Sí, mientras esté pendiente puedes cancelarla sin costo.</p>
                        </details>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
