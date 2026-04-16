import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home';
import Cars from './pages/cars/cars';
import { Rental } from './pages/rental/rental';
import Sale from './pages/sale/sale';
import Buy from './pages/buy/buy';
import Services from './pages/services/services';
import AboutUs from './pages/aboutUs/aboutUs';
import FAQ from './pages/faq/faq';
import Contact from './pages/contact/contact';
import CarAnimation from './pages/authentication/auth';
import Login from './pages/authentication/login';
import Signup from './pages/authentication/signup';
import { AuthProvider } from './backendConnection/context'; 
import AdminRoutes from './admin/adminRoutes';
import { AppProvider } from './backendConnection/translationContext';
import CarDetail from './components/carDetail/carDetail';
import UserDashboard from './pages/userDashboard/userDashboard';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/rental" element={<Rental />} />
            <Route path="/sales" element={<Sale />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/auth" element={<CarAnimation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/profile" element={<UserDashboard />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
