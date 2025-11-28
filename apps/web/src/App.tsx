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

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/publish" element={<PublishRidePage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/trips" element={<MyTripsPage />} />
                        {/* Add more routes here */}
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
