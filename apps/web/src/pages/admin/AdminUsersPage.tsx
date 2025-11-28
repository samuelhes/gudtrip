import { useEffect, useState } from 'react';
import api from '../../services/api';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';

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

    useEffect(() => {
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

        fetchUsers();
    }, []);

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
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
