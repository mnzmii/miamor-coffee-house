import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomerPage from './pages/CustomerPage'
import StaffDashboard from './pages/StaffDashboard'
import RoomManagement from './pages/RoomManagement'
import KitchenBoard from './pages/KitchenBoard'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CustomerPage />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/staff/rooms" element={<RoomManagement />} />
                <Route path="/kitchen" element={<KitchenBoard />} />
            </Routes>
        </Router>
    )
}

export default App
