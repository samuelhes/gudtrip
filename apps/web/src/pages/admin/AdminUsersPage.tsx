import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Ban, CheckCircle } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
    status: string;
    created_at: string;
}

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionModal, setActionModal] = useState<{ show: boolean; user: UserData | null; action: 'BAN' | 'ACTIVATE' | null }>({
        show: false,
        user: null,
        action: null
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
            alert(`Usuario ${newStatus === 'BANNED' ? 'baneado' : 'activado'} exitosamente`);
            setActionModal({ show: false, user: null, action: null });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Error al actualizar usuario');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Gestión de Usuarios</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Usuario</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rol</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha Registro</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {user.first_name?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        {user.roles.map((role) => (
                                            <span key={role} className={`px-2 py-1 rounded-lg text-xs font-bold ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                role === 'DRIVER' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        user.status === 'BANNED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {user.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {user.status === 'ACTIVE' ? (
                                            <button
                                                onClick={() => setActionModal({ show: true, user, action: 'BAN' })}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Banear
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setActionModal({ show: true, user, action: 'ACTIVATE' })}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Activar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Modal */}
            {actionModal.show && actionModal.user && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                        <div className={`flex items-center gap-3 ${actionModal.action === 'BAN' ? 'text-red-600' : 'text-green-600'}`}>
                            {actionModal.action === 'BAN' ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                            <h3 className="text-xl font-bold">
                                {actionModal.action === 'BAN' ? 'Banear Usuario' : 'Activar Usuario'}
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            ¿Estás seguro de que deseas {actionModal.action === 'BAN' ? 'banear' : 'activar'} a{' '}
                            <strong>{actionModal.user.first_name} {actionModal.user.last_name}</strong>?
                        </p>
                        {actionModal.action === 'BAN' && (
                            <p className="text-sm text-red-600 font-medium">
                                ⚠️ El usuario no podrá iniciar sesión
                            </p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActionModal({ show: false, user: null, action: null })}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleStatusChange(
                                    actionModal.user!.id,
                                    actionModal.action === 'BAN' ? 'BANNED' : 'ACTIVE'
                                )}
                                className={`flex-1 py-3 rounded-xl font-bold text-white ${actionModal.action === 'BAN' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {actionModal.action === 'BAN' ? 'Banear' : 'Activar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
