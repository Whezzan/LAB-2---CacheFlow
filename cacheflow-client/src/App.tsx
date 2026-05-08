import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import HomePage from './features/home/HomePage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import AuctionListPage from './features/auctions/AuctionListPage'
import AuctionDetailPage from './features/auctions/AuctionDetailPage'
import CreateAuctionPage from './features/auctions/CreateAuctionPage'
import EditAuctionPage from './features/auctions/EditAuctionPage'
import ProfilePage from './features/profile/ProfilePage'
import AdminDashboard from './features/admin/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/auctions"   element={<AuctionListPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/sell"               element={<CreateAuctionPage />} />
              <Route path="/auctions/:id/edit"  element={<EditAuctionPage />} />
              <Route path="/profile"            element={<ProfilePage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/auctions/:id" element={<AuctionDetailPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
