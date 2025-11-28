import { Link } from 'react-router-dom';
import { Car, User, LogOut } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Car className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">gudtrip</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/publish" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Publicar Viaje
                                </Link>
                                <Link to="/wallet" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                                    <span className="text-xl">💰</span>
                                    <span>Billetera</span>
                                </Link>
                                <Link to="/trips" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Mis Viajes
                                </Link>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="h-5 w-5" />
                                    <span>{user.first_name}</span>
                                </div>
                                <button onClick={logout} className="text-gray-500 hover:text-red-600">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
