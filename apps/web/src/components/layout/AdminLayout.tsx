import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Car, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold text-blue-500">gudtrip</h1>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                        <Users className="w-5 h-5" />
                        Usuarios
                    </Link>
                    <Link to="/admin/rides" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                        <Car className="w-5 h-5" />
                        Viajes
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
