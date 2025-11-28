import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';

interface PublishTravelNeedForm {
    origin_city: string;
    destination_city: string;
    date: string;
    start_time: string;
    end_time: string;
}

export const PublishTravelNeedPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PublishTravelNeedForm>();
    const [serverError, setServerError] = useState<string | null>(null);

    const onSubmit = async (data: PublishTravelNeedForm) => {
        try {
            setServerError(null);
            await api.post('/travel-needs', data);
            navigate('/travel-needs'); // Redirect to list or dashboard
        } catch (error: any) {
            console.error('Error publishing travel need:', error);
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Ocurrió un error al publicar tu necesidad de viaje.');
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Publicar Necesidad de Viaje</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {serverError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Origen</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        {...register('origin_city', { required: 'El origen es requerido' })}
                                        placeholder="Ciudad de origen"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.origin_city && <p className="text-sm text-red-600">{errors.origin_city.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Destino</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        {...register('destination_city', { required: 'El destino es requerido' })}
                                        placeholder="Ciudad de destino"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.destination_city && <p className="text-sm text-red-600">{errors.destination_city.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="date"
                                    {...register('date', { required: 'La fecha es requerida' })}
                                    className="pl-10"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Hora Inicio (Rango)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="time"
                                        {...register('start_time', { required: 'La hora de inicio es requerida' })}
                                        className="pl-10"
                                    />
                                </div>
                                {errors.start_time && <p className="text-sm text-red-600">{errors.start_time.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Hora Fin (Rango)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="time"
                                        {...register('end_time', { required: 'La hora de fin es requerida' })}
                                        className="pl-10"
                                    />
                                </div>
                                {errors.end_time && <p className="text-sm text-red-600">{errors.end_time.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isSubmitting}
                            >
                                Publicar Necesidad
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
