import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Wallet, CreditCard, Plus, ArrowDownLeft } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND';
    amount: number;
    description: string;
    created_at: string;
}

interface WalletData {
    balance: number;
    transactions?: Transaction[];
}

export const WalletPage = () => {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingFunds, setAddingFunds] = useState(false);
    const [amount, setAmount] = useState('');

    const fetchWallet = async () => {
        try {
            const response = await api.get('/wallet');
            setWallet(response.data);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/wallet/deposit', { amount: Number(amount) });
            setAmount('');
            setAddingFunds(false);
            fetchWallet();
        } catch (error) {
            console.error('Error adding funds:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">Balance Total</p>
                            <h2 className="text-4xl font-bold flex items-center gap-2">
                                {wallet?.balance || 0} <span className="text-2xl opacity-80">Tokens</span>
                            </h2>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setAddingFunds(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Cargar Tokens
                        </button>
                    </div>
                </div>

                {/* Add Funds Modal/Form */}
                {addingFunds && (
                    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            Cargar Saldo
                        </h3>
                        <form onSubmit={handleAddFunds} className="flex gap-4">
                            <input
                                type="number"
                                min="1"
                                required
                                placeholder="Cantidad de tokens"
                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Pagar
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddingFunds(false)}
                                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                )}

                {/* Recent Transactions (Mocked for now as backend doesn't return list yet) */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Actividad Reciente</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Carga de Saldo</p>
                                    <p className="text-sm text-gray-500">Hoy, 10:30 AM</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">+50 Tokens</span>
                        </div>
                        {/* More items... */}
                    </div>
                </div>
            </div>
        </div>
    );
};
