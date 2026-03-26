import { useState } from "react";
import API from "../../pages/auth/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
   
  const [form, setForm] = useState({
    type: "",
    brand : "",
    model: "",
    vin: "",
    category: "",
    year: "",
    engine_type: "",
    fuel: "",
    transmission: "",
    color: "",
    seats: "",
    price_per_day: "",
    sale_price: "",
    status: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();

formData.append("type", form.type);
formData.append("brand", form.brand);
formData.append("model", form.model);
formData.append("vin", form.vin);
formData.append("category", form.category);
formData.append("year", form.year);
formData.append("engine_type", form.engine_type);
formData.append("fuel", form.fuel);
formData.append("transmission", form.transmission);
formData.append("color", form.color);
formData.append("seats", form.seats);
formData.append("price_per_day", form.price_per_day);
formData.append("sale_price", form.sale_price);
formData.append("status", form.status);

      if (image) {
        formData.append("image", image);
      }


      const res = await API.post('/cars/dashboard', formData);

      console.log("SERVER RESPONSE:", res.data);

    } catch (err) {

      console.error("AXIOS ERROR:", err);
      console.error("SERVER ERROR:", err.response?.data);

    }
   
  };

  return (
    <div>

      <h3>Add New Car</h3>

      <form onSubmit={handleSubmit}>
  {/* Type: Rental or Sales */}
  <select name="type" onChange={handleChange} required>
    <option value="">Select Type</option>
    <option value="Rental">Rental</option>
    <option value="Sales">Sales</option>
  </select>

  {/* Brand */}
  <input
    type="text"
    name="brand"
    placeholder="Brand"
    onChange={handleChange}
    required
  />

  {/* Model */}
  <input
    type="text"
    name="model"
    placeholder="Model"
    onChange={handleChange}
    required
  />

  {/* VIN */}
  <input
    type="number"
    name="vin"
    placeholder="VIN"
    onChange={handleChange}
    required
  />

  {/* Category */}
  <select name="category" onChange={handleChange} required>
    <option value="">Select Category</option>
    <option value="Ekonomike">Ekonomike</option>
    <option value="Kompakt">Kompakt</option>
    <option value="SUV">SUV</option>
    <option value="Luksoze">Luksoze</option>
    <option value="Elektrike">Elektrike</option>
    <option value="Hibride">Hibride</option>
  </select>

  {/* Year */}
  <input
    type="number"
    name="year"
    placeholder="Year"
    onChange={handleChange}
    required
  />

  {/* Engine Type */}
  <input
    type="text"
    name="engine_type"
    placeholder="Engine Type"
    onChange={handleChange}
    required
  />

  {/* Fuel */}
  <input
    type="text"
    name="fuel"
    placeholder="Fuel"
    onChange={handleChange}
    required
  />

  {/* Transmission */}
  <input
    type="text"
    name="transmission"
    placeholder="Transmission"
    onChange={handleChange}
    required
  />

  {/* Color */}
  <input
    type="text"
    name="color"
    placeholder="Color"
    onChange={handleChange}
    required
  />

  {/* Seats */}
  <input
    type="number"
    name="seats"
    placeholder="Seats"
    onChange={handleChange}
    required
  />

  {/* Price Per Day */}
  <input
    type="number"
    name="price_per_day"
    placeholder="Price Per Day"
    onChange={handleChange}
    required
  />

  {/* Sale Price */}
  <input
    type="number"
    name="sale_price"
    placeholder="Sale Price"
    onChange={handleChange}
  />

  {/* Status */}
  <select name="status" onChange={handleChange} required>
    <option value="">Select Status</option>
    <option value="Available">Available</option>
    <option value="Reserved">Reserved</option>
    <option value="Pending">Pending</option>
    <option value="Sold">Sold</option>
  </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

       <button type="submit" onClick={handleSubmit}>
Add Car
</button>

      </form>

      <Link to="/getCar">Back to Cars List</Link>

    </div>
  );
};

export default Dashboard;