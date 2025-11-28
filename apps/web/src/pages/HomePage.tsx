import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CitySelector } from '../components/common/CitySelector';

export const HomePage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState({ origin: '', destination: '', date: '' });

    const handleSearch = () => {
        navigate(`/search?origin=${search.origin}&destination=${search.destination}&date=${search.date}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-6xl font-bold mb-6">
                        Tu viaje, tu comunidad.
                    </h1>
                    <p className="text-lg md:text-2xl mb-10 text-blue-100">
                        Comparte gastos, conoce gente y viaja cómodo con gudtrip.
                    </p>

                    {/* Search Box */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <CitySelector
                                value={search.origin}
                                onChange={(value) => setSearch({ ...search, origin: value })}
                                placeholder="¿De dónde sales?"
                                label="Origen"
                            />
                        </div>
                        <div className="w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1">
                            <CitySelector
                                value={search.destination}
                                onChange={(value) => setSearch({ ...search, destination: value })}
                                placeholder="¿A dónde vas?"
                                label="Destino"
                            />
                        </div>
                        <div className="w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 text-left">Fecha</label>
                            <input
                                type="date"
                                className="w-full p-2 text-gray-900 font-semibold focus:outline-none rounded-lg border border-gray-200"
                                value={search.date}
                                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="bg-white py-16 border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Cómo funciona?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">1</div>
                            <h3 className="text-xl font-bold">Busca o Publica</h3>
                            <p className="text-gray-600">Encuentra un viaje que te sirva o publica tus asientos libres.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">2</div>
                            <h3 className="text-xl font-bold">Reserva y Paga</h3>
                            <p className="text-gray-600">Usa tus tokens para reservar al instante. Sin efectivo, sin problemas.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">3</div>
                            <h3 className="text-xl font-bold">Viaja y Califica</h3>
                            <p className="text-gray-600">Disfruta el viaje y califica a tu compañero para mantener la comunidad segura.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Por qué usar gudtrip?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">💰</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">Ahorra dinero</h3>
                        <p className="text-gray-600">Comparte los gastos de gasolina y peajes. Viajar acompañado es más barato.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">Viaja seguro</h3>
                        <p className="text-gray-600">Comunidad verificada. Revisa perfiles y evaluaciones antes de viajar.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">Fácil y rápido</h3>
                        <p className="text-gray-600">Reserva tu cupo en segundos. Sin efectivo, todo con tokens virtuales.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
