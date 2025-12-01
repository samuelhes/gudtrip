import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PublishRidePage } from './pages/rides/PublishRidePage';
import { SearchResultsPage } from './pages/rides/SearchResultsPage';
import { WalletPage } from './pages/wallet/WalletPage';
import { MyTripsPage } from './pages/trips/MyTripsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { PublishTravelNeedPage } from './pages/travel-needs/PublishTravelNeedPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DriverDocumentsPage } from './pages/driver/DriverDocumentsPage';
import HelpCenterPage from './pages/help/HelpCenterPage';
import { RequestRideArticle } from './pages/help/articles/RequestRideArticle';
import { PublishRideArticle } from './pages/help/articles/PublishRideArticle';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRidesPage } from './pages/admin/AdminRidesPage';
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage';
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
                            <Route path="/publish" element={<PublishRidePage />} />
                            <Route path="/search" element={<SearchResultsPage />} />
                            <Route path="/help" element={<HelpCenterPage />} />
                            <Route path="/help/request-ride" element={<RequestRideArticle />} />
                            <Route path="/help/publish-ride" element={<PublishRideArticle />} />

                            {/* Protected User Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/wallet" element={<WalletPage />} />
                                <Route path="/trips" element={<MyTripsPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/travel-needs/publish" element={<PublishTravelNeedPage />} />
                                <Route path="/notifications" element={<NotificationsPage />} />
                                <Route path="/driver/verify" element={<DriverDocumentsPage />} />
                            </Route>
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="users" element={<AdminUsersPage />} />
                                <Route path="rides" element={<AdminRidesPage />} />
                                <Route path="documents" element={<AdminDocumentsPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
