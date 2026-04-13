import NavBar from '../../components/navbar/navbar';
import './cars.css';
import Carousel from '../../components/carousel/carousel';
import Footer from '../../components/footer/footer';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../backendConnection/api';
import CarCard from '../../components/carCard/carCard';
import Sidebar from '../../components/filters/sidebar';

const sortOptions = [
  { value: 'default',    label: 'Default' },
  { value: 'price_desc', label: 'Cmimi me i shtrenjte' },
  { value: 'price_asc',  label: 'Cmimi me i lire' },
  { value: 'newest',     label: 'Te rejat' },
];
const perPageOptions = [24, 48, 72, 96];

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find((o) => (o.value ?? o) === value);

  return (
    <div ref={ref} id="carsDropdown">
      <button className="dropdownBtn" onClick={() => setOpen((p) => !p)}>
        <span>{label}: <strong>{selected?.label ?? selected ?? value}</strong></span>
        <span className="dropdownArrow">{open ? '▲' : '▼'}</span>
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
      if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div id="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="pageBtn">&lt;</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={'d' + i} className="dots">...</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)} className={`pageBtn ${currentPage === p ? 'active' : ''}`}>{p}</button>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pageBtn">&gt;</button>
    </div>
  );
}

const FILTER_KEYS = [
  'search', 'category', 'type', 'brand', 'fuel', 'transmission',
  'color', 'seats', 'doors', 'yearMin', 'yearMax', 'minPrice', 'maxPrice'
];

function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters]         = useState({});
  const [cars, setCars]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [sortValue, setSortValue]     = useState('default');
  const [perPage, setPerPage]         = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars]     = useState(0);

  const activeFilters = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, searchParams.get(k) || ''])
  );

  useEffect(() => { setCurrentPage(1); }, [searchParams]);

  useEffect(() => {
    API.get('/cars/filters')
      .then((res) => setFilters(res.data))
      .catch((err) => console.error('Filters error:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((k) => { if (activeFilters[k]) params.append(k, activeFilters[k]); });
    params.append('page', currentPage);
    params.append('limit', perPage);
    if (sortValue !== 'default') params.append('sort', sortValue);

    API.get('/cars?' + params.toString())
      .then((res) => { setCars(res.data.data || []); setTotalCars(res.data.total || 0); })
      .catch((err) => console.error('Cars error:', err))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sortValue, perPage, currentPage]);

  const handleFilterChange = (key, value) => {
    if (key === '__reset__') { setSearchParams({}); setCurrentPage(1); return; }
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const totalPages = Math.ceil(totalCars / perPage);
  const hasActiveFilters = FILTER_KEYS.some((k) => activeFilters[k]);
  const activeFilterCount = FILTER_KEYS.filter((k) => activeFilters[k]).length;

  return (
    <div id="cars">
      <NavBar />
      <div className="carousel"><Carousel /></div>

      <section className="carsPage">
        <div className="toolbarOuter">
          <h1 className="pageTitle">Flota jonë</h1>

          {hasActiveFilters && (
            <p className="carsSearchActive">
              {activeFilters.search && `Kërkimi: "${activeFilters.search}"`}
              {activeFilters.category && ` · Kategoria: ${activeFilters.category}`}
              {activeFilters.brand && ` · Marka: ${activeFilters.brand}`}
              {activeFilters.type && ` · Tipi: ${activeFilters.type}`}
              {' '}— {totalCars} rezultate
            </p>
          )}

          <div className="toolbar">
            <span className="total">Numri i mjeteve: {totalCars}</span>
            <div className="toolbarRight">
              <Dropdown label="Rendit sipas" options={sortOptions} value={sortValue} onChange={(v) => { setSortValue(v); setCurrentPage(1); }} />
              <Dropdown label="Shiko nga" options={perPageOptions} value={perPage} onChange={(v) => { setPerPage(v); setCurrentPage(1); }} />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>

        <div className="carsBody">
          <button
            className="filtersToggleBtn"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            Filtrat {activeFilterCount > 0 ? `(${activeFilterCount})` : ''} {sidebarOpen ? '⮝' : '⮟'}
          </button>

          <div className={`sidebarWrapper${sidebarOpen ? ' sidebarOpen' : ''}`}>
            <Sidebar
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              showType={true}
            />
          </div>

          <main className="carsMain">
            {loading ? (
              <p>Duke ngarkuar...</p>
            ) : cars.length === 0 ? (
              <div className="empty">
                <p>Nuk u gjeten makina.</p>
                <button className="carsSearchClear" onClick={() => setSearchParams({})}>Pastro filtrat</button>
              </div>
            ) : (
              <div className="carsGrid">
                {cars.map((car) => (<CarCard key={car.id} car={car} />))}
              </div>
            )}
            <div className="paginationBottom">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </main>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Cars;