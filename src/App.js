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

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/rental' element={<Rental/>} />
        <Route path='/sales' element={<Sale/>} />
        <Route path='/buy' element={<Buy/>} />
        <Route path='/services' element={<Services/>} />
        <Route path='/aboutUs' element={<AboutUs/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/faq' element={<FAQ/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
