import "./carCard.css";
import g from "../../assets/glc300.png"

const CarCard = () => {
  const mockCar = {
    name: "BMW M4",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    price: 120
  };

    
  return (
    <div className="car-card">
      <div className="car-image">
        <img src={g} alt={mockCar.name} />
      </div>

      <div className="car-content">
        <h3>{mockCar.name}</h3>

        <div className="car-specs">
          <span>{mockCar.transmission}</span>
          <span>{mockCar.fuel}</span>
          <span>{mockCar.seats} seats</span>
        </div>

        <div className="car-footer">
          <div className="price">
            <span>${mockCar.price}</span>
            <small>/day</small>
          </div>

          <button className="rent-btn">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;