import Navigimi from "../../components/navbar/navbar";
import "./sales.css";
import CarBrands from "../../components/carousel/carousel";
import { useState } from "react";
import Footer from "../../components/footer/footer";
function Sales(){

  
const carBrands = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Toyota",
  "Ford",
  "Hyundai",
  "Kia",
  "Nissan",
  "Peugeot",
  "Renault",
  "Skoda",
  "Volvo",
  "Porsche",
  "Lexus",
  "Mazda",
  "Mini",
  "Tesla",
  "Land Rover",
  "Jaguar",
  // +100 pa prekur JSX
];

const currentYear = new Date().getFullYear();

const years = Array.from(
  { length: currentYear - 1999 },
  (_, i) => currentYear - i
);


const carsData = [
  {
    id: 1,
    brand: "BMW",
    name: "BMW X5",
    year: 2021,
    fuel: "Dizel",
    transmission: "Automatik",
    km: "45,000 km",
    price: "€32,500",
    image: "/bmw-x5.jpg"
  },
  {
    id: 2,
    brand: "Audi",
    name: "Audi Q7",
    year: 2020,
    fuel: "Benzinë",
    transmission: "Automatik",
    km: "38,000 km",
    price: "€29,800",
    image: "/audi-q7.jpg"
  }
];


    const Pagination = () => (
  <div className="pagination">
    <button
      disabled={page === 1}
      onClick={() => setPage(p => p - 1)}
    >
      ‹
    </button>

    <span>{page} / {totalPages}</span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(p => p + 1)}
    >
      ›
    </button>
  </div>
);

  const MIN = 20;
  const MAX = 200;
  const GAP = 10;

  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(200);

  const minPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((maxPrice - MIN) / (MAX - MIN)) * 100;

 const carModels = [
  { brand: "BMW", model: "X5" },
  { brand: "BMW", model: "X3" },
  { brand: "Audi", model: "Q7" },
  { brand: "Audi", model: "A6" },
  { brand: "Mercedes", model: "GLC" },
  { brand: "Mercedes", model: "E-Class" },
  { brand: "Toyota", model: "RAV4" },
  { brand: "Volkswagen", model: "Tiguan" }
];

const fuels = ["Dizel", "Benzinë", "Elektrike", "Hibride"];
const transmissions = ["Automatik", "Manual"];
const images = ["/bmw.jpg", "/audi.jpg", "/mercedes.jpg"];

const [perPage, setPerPage] = useState(20);

  const [page, setPage] = useState(1);

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const visibleCars = carsData.slice(start, end);
  const totalPages = Math.ceil(carsData.length / perPage);

  const handlePerPageChange = (e) => {
  setPerPage(Number(e.target.value));
  setPage(1);
};

    return(
        <>
        <Navigimi />
        <div className="carsMarquee">
        <CarBrands /></div>
        <section className="cars-page">

  {/* HEADER */}
  <div className="cars-header">
  <div>
    <h1>Flota jonë</h1>
    <span className="cars-count">
      {carsData.length} makina të disponueshme
    </span>
  </div>

  <div className="cars-header-controls">
    <select className="cars-sort">
      <option>Më të rejat</option>
      <option>Çmimi: Ulët → Lartë</option>
      <option>Çmimi: Lartë → Ulët</option>
      <option>Viti</option>
      <option>Kilometra</option>
    </select>

    <select
      className="cars-limit"
      value={perPage}
      onChange={handlePerPageChange}
    >
      <option value={20}>20</option>
      <option value={40}>40</option>
      <option value={60}>60</option>
      <option value={80}>80</option>
      <option value={100}>100</option>
    </select>

    <Pagination />
  </div>
</div>

  {/* MAIN */}
  <div className="cars-layout">

    {/* FILTERS */}
    <aside className="cars-filters">
      <h3>Filtra</h3>
   <div className="price-filter">
      <h3>Çmimi</h3>

      <div className="price-values">
        <span>${minPrice}</span>
        <span>${maxPrice}</span>
      </div>

      <div className="range-container">
        <div className="track"></div>
        <div
          className="range-fill"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        ></div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step="5"
          value={minPrice}
          onChange={(e) => {
            const val = Math.min(+e.target.value, maxPrice - GAP);
            setMinPrice(val);
          }}
        />

        <input
          type="range"
          min={MIN}
          max={MAX}
          step="5"
          value={maxPrice}
          onChange={(e) => {
            const val = Math.max(+e.target.value, minPrice + GAP);
            setMaxPrice(val);
          }}
        />
      </div>

      <p className="per-day">për ditë</p>
    </div>

<div className="filter-group">
  <label>Marka</label>

  <input
    list="car-brands"
    placeholder="Zgjidh ose kërko markën"
    className="filter-input"
  />

  <datalist id="car-brands">
    {carBrands.map(brand => (
      <option key={brand} value={brand} />
    ))}
  </datalist>
</div>


<div className="filter-group">
  <label>Viti</label>

  <input
    list="car-years"
    placeholder="Viti i makinës"
    className="filter-input"
  />

  <datalist id="car-years">
    {years.map(year => (
      <option key={year} value={year} />
    ))}
  </datalist>
</div>

      <div className="filter-group">
  <label>Karburanti</label>

  <input
    list="fuel-types"
    placeholder="Zgjidh ose kërko"
    className="filter-input"
  />

  <datalist id="fuel-types">
    {[
      "Naftë",
      "Gaz",
      "Benzinë",
      "Elektrike",
      "Hibride"
    ].map(fuel => (
      <option key={fuel} value={fuel} />
    ))}
  </datalist>
</div>


      <div className="filter-group">
  <label>Transmisioni</label>

  <input
    list="transmission-types"
    placeholder="Zgjidh ose kërko"
    className="filter-input"
  />

  <datalist id="transmission-types">
    {[
      "Automatik",
      "Manual",
      "Robotik"
    ].map(type => (
      <option key={type} value={type} />
    ))}
  </datalist>
</div>

    </aside>

     <div className="cars-grid">
        {visibleCars.map(car => (
          <div className="car-card" key={car.id}>
            <img src={car.image} alt={car.name} />

            <div className="car-info">
              <h4>{car.name}</h4>

              <div className="car-specs">
                <span>⛽ {car.fuel}</span>
                <span>⚙ {car.transmission}</span>
                <span>📏 {car.km}</span>
              </div>

              <div className="car-footer">
                <strong>{car.price}</strong>
                <button>Shiko detajet</button>
              </div>
            </div>
          </div>
        ))} </div>

        <Pagination />

  </div>


</section>
<Footer />
        </>
    );
}
export default Sales