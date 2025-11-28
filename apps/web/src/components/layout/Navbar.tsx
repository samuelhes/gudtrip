import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, User, LogOut, Menu, X } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Car className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">gudtrip</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
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
                                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                                    <User className="h-5 w-5" />
                                    <span className="font-medium">{user.first_name}</span>
                                </Link>
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

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-40">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium text-gray-900 border-b mb-2">
                                    Hola, {user.first_name}
                                </div>
                                <Link
                                    to="/publish"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 active:bg-gray-50 active:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Publicar Viaje
                                </Link>
                                <Link
                                    to="/wallet"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 active:bg-gray-50 active:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Billetera
                                </Link>
                                <Link
                                    to="/trips"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 active:bg-gray-50 active:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Mis Viajes
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 active:bg-gray-50 active:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Mi Perfil
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 active:bg-red-50"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 active:bg-gray-50 active:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 font-bold active:bg-blue-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
