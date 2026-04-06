import NavBar from "../../components/navbar/navbar";
import "./cars.css";
import Carousel from "../../components/carousel/carousel";
import Footer from "../../components/footer/footer";
import { useEffect, useState, useRef } from "react";
import API from "../../backendConnection/api";
import CarCard from "../../components/carCard/carCard";
import Sidebar from "../../components/filters/sidebar";

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price_desc", label: "Cmimi me i shtrenjte" },
  { value: "price_asc", label: "Cmimi me i lire" },
  { value: "newest", label: "Te rejat" },
];
const perPageOptions = [24, 48, 72, 96];

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => (o.value ?? o) === value);

  return (
    <div ref={ref} id="carsDropdown">
      <button className="dropdownBtn" onClick={() => setOpen((p) => !p)}>
        <span>{label}: <strong>{selected?.label ?? selected ?? value}</strong></span>
        <span className="dropdownArrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="dropdownMenu">
          {options.map((o) => {
            const val = o.value ?? o;
            const lbl = o.label ?? o;
            return (
              <label key={val} className="dropdownItem">
                <input
                  type="checkbox"
                  checked={value === val}
                  onChange={() => { onChange(val); setOpen(false); }}
                />
                {lbl}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div id="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pageBtn"
      >
        &lt;
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={"d" + i} className="dots">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`pageBtn ${currentPage === p ? "active" : ""}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pageBtn"
      >
        &gt;
      </button>
    </div>
  );
}

function Cars() {
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortValue, setSortValue] = useState("default");
  const [perPage, setPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    API.get("/cars/filters")
      .then((res) => setFilters(res.data))
      .catch((err) => console.error("Filters error:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    Object.entries(activeFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });

    params.append("page", currentPage);
    params.append("limit", perPage);
    if (sortValue !== "default") params.append("sort", sortValue);

    API.get("/cars?" + params.toString())
      .then((res) => {
        setCars(res.data.data || []);
        setTotalCars(res.data.total || 0);
      })
      .catch((err) => console.error("Cars error:", err))
      .finally(() => setLoading(false));
  }, [activeFilters, sortValue, perPage, currentPage]);

  const handleFilterChange = (key, value) => {
    if (key === "__reset__") {
      setActiveFilters({});
      setCurrentPage(1);
      return;
    }
    setCurrentPage(1);
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalPages = Math.ceil(totalCars / perPage);

  return (
    <div id="cars">
      <NavBar />

      <div className="carousel">
        <Carousel />
      </div>

      <section className="carsPage">

        <div className="toolbarOuter">
          <h1 className="pageTitle">Flota jonë</h1>
        
          <div className="toolbar">
            <span className="total">Numri i mjeteve: {totalCars}</span>

            <div className="toolbarRight">
              <Dropdown
                label="Rendit sipas"
                options={sortOptions}
                value={sortValue}
                onChange={(v) => { setSortValue(v); setCurrentPage(1); }}
              />

              <Dropdown
                label="Shiko nga"
                options={perPageOptions}
                value={perPage}
                onChange={(v) => { setPerPage(v); setCurrentPage(1); }}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        <div className="carsBody">
          <Sidebar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />

          <main className="carsMain">
            {loading ? (
              <p>Duke ngarkuar...</p>
            ) : cars.length === 0 ? (
              <p className="empty">Nuk u gjeten makina me keto filtra.</p>
            ) : (
              <div className="carsGrid">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            <div className="paginationBottom">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </main>
        </div>

      </section>

      <Footer />
    </div>
  );
}

export default Cars;