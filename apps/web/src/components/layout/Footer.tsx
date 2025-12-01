import { Link } from 'react-router-dom';
import { APP_VERSION } from '../../config/version';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Gudtrip</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/" className="hover:text-primary-600">Inicio</Link></li>
                            <li><Link to="/publish" className="hover:text-primary-600">Publicar Viaje</Link></li>
                            <li><Link to="/help" className="hover:text-primary-600">Ayuda</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Usuario</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/login" className="hover:text-primary-600">Iniciar Sesión</Link></li>
                            <li><Link to="/register" className="hover:text-primary-600">Registrarse</Link></li>
                            <li><Link to="/profile" className="hover:text-primary-600">Mi Perfil</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Mi Cuenta</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/my-trips" className="hover:text-primary-600">Mis Viajes</Link></li>
                            <li><Link to="/wallet" className="hover:text-primary-600">Billetera</Link></li>
                            <li><Link to="/driver/documents" className="hover:text-primary-600">Ser Conductor</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Admin</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/admin" className="hover:text-primary-600">Panel Admin</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Gudtrip. v{APP_VERSION}
                    </p>
                </div>
            </div>
        </footer>
    );
};
