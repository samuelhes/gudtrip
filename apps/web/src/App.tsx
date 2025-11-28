import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PublishRidePage } from './pages/rides/PublishRidePage';
import { SearchResultsPage } from './pages/rides/SearchResultsPage';
import { WalletPage } from './pages/wallet/WalletPage';
import { MyTripsPage } from './pages/trips/MyTripsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 font-sans">
                    {/* Navbar is now likely handled within the Layout component */}
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Public Routes with Navbar */}
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/publish" element={<PublishRidePage />} />
                            <Route path="/search" element={<SearchResultsPage />} />

                            {/* Protected User Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/wallet" element={<WalletPage />} />
                                <Route path="/trips" element={<MyTripsPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="users" element={<AdminUsersPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
