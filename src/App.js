import Buy from "./pages/buy/buy.js"
import Home from './pages/home/home.js';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import Reservation from './pages/reservation/reservation.js';
import Cars from './pages/cars/cars.js';
import Sales from './pages/sales/sales.js';
import Services from './pages/services/services.js';
import AboutUs from './pages/aboutUs/aboutUs.js';
import Contact from './pages/contact/contact.js';
import Pytje from './pages/faq/faq.js';
import CarAnimation from './pages/auth/authentication/authentication.js';
import Login from './pages/auth/login/login.js'
import Signup from './pages/auth/signup/signup.js';
import GetCars from "./pages/cars/getCar.js";
import ReservationForm from "./components/reservation/reservation.js";


function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path="/auth" element={<CarAnimation />} />
       <Route path="/api/auth/makinat" element={<GetCars />} />
        
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup/>} />
       <Route path="/" element={<Home/>} />
       <Route path="/cars" element={<Cars />} />
       <Route path="/reservation" element={<Reservation />} />
       <Route path="/sales" element={<Sales />} />
       <Route path="/reservationform" element={<ReservationForm/>} />
       <Route path="/buy" element={<Buy />} />
       <Route path="/services" element={<Services />} />
       <Route path="/aboutUS" element={<AboutUs />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/faq" element={<Pytje />} />
     </Routes>
   </BrowserRouter>
  );
}

export default App
