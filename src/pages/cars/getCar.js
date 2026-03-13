import { useState, useEffect } from "react";
import API from "../auth/api";

const GetCars = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await API.get("/api/cars/makinat");
                setCars(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCars();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            {cars.map((car) => (
                <div
                    key={car.id}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <p><strong>{car.brand} {car.model}</strong></p>
                    <p>Category: {car.category}</p>
                    <p>Engine: {car.engine_type}</p>
                    <p>Transmission: {car.transmission}</p>
                    <p>Color: {car.color}</p>
                    <p>Seats: {car.seats}</p>
                </div>
            ))}
        </div>
    );
};

export default GetCars;