import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import MenuPage from './pages/MenuPage'
import StaffDashboard from './pages/StaffDashboard'
import RoomManagement from './pages/RoomManagement'
import KitchenBoard from './pages/KitchenBoard'
import QRGeneratorPage from './pages/QRGeneratorPage'
import OrderStatusPage from './pages/OrderStatusPage'
import StaffLoginPage from './pages/StaffLoginPage'

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/order/:id" element={<OrderStatusPage />} />

                    {/* Auth */}
                    <Route path="/staff/login" element={<StaffLoginPage />} />

                    {/* Protected staff routes */}
                    <Route path="/staff" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
                    <Route path="/staff/rooms" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
                    <Route path="/staff/qr" element={<ProtectedRoute><QRGeneratorPage /></ProtectedRoute>} />
                    <Route path="/kitchen" element={<ProtectedRoute><KitchenBoard /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
