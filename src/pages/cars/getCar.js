import { useState, useEffect } from 'react';
import API from '../auth/api';
import "../cars/cars.css"
import { Link } from 'react-router-dom';

const GetCar = () => {

    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await API.get('/cars/getCar');
                
                console.log(res);
                setCars(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCars();
    }, []);
    console.log(cars);

    return (
        <div id='card'>
            <h2>Cars List</h2>

            <Link to="/dashboard">Add New Car</Link>

{cars.map((car) => (
    <div className="car-card">
      <div className="car-image">
        {car.media && car.media.length > 0 ? (
          <img src={`http://localhost:5000/uploads/${car.media[0].image_path}`} alt={car.model} />
        ) : (
          <div className="placeholder">Awaiting image</div>
        )}
      </div>
      <div className="car-details">
        <span className="car-type">{car.category}</span>
        <h3 className="car-model">{car.brand} {car.model}</h3>
        <div className="car-specs">
          <span>{car.seats} seats</span>
          <span>{car.doors || 4} doors</span>
          <span>{car.transmission}</span>
        </div>
      </div>
      <div className="car-actions">
        <button className="info-btn">Car Info</button>
        <button className="book-btn">Book Now</button>
      </div>
    </div>
  ))}
        </div>
    );
};

export default GetCar;