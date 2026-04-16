import { useEffect, useState } from 'react';
import './sidebar.css';

const ColorMap = {
  black: '#111', white: '#f9f9f9', grey: '#888', silver: '#C0C0C0',
  red: '#e53e3e', blue: '#3182ce', green: '#38a169', yellow: '#ECC94B',
  orange: '#ED8936', brown: '#744210', beige: '#F5F0DC', gold: '#D4AF37',
  purple: '#805AD5', pink: '#ED64A6', violet: '#6B46C1', maroon: '#800000',
  cyan: '#00BCD4', turquoise: '#40E0D0', navy: '#001F5B', lime: '#84CC16',
  bronze: '#CD7F32', cream: '#FFFDD0', pearl: '#EAE0C8', cherry: '#DE3163',
  mint: '#98FF98', teal: '#008080', magenta: '#FF00FF', indigo: '#4B0082',
  khaki: '#C3B091', olive: '#808000', tan: '#D2B48C',
};

const ColorNames = {
  black: 'E zeze', white: 'E bardhe', grey: 'Gri', silver: 'Argjente',
  red: 'E kuqe', blue: 'Blu', green: 'E gjelber', yellow: 'E verdhe',
  orange: 'Portokalli', brown: 'Kafe', beige: 'Bezhe', gold: 'Ari',
  purple: 'Vjollce', pink: 'Roze', violet: 'Violet', maroon: 'Geshtenje',
  cyan: 'Cian', turquoise: 'Turkez', navy: 'Blu detare', lime: 'Gelberim',
  bronze: 'Bronz', cream: 'Kreme', pearl: 'Perle', cherry: 'Qershi',
  mint: 'Mente', teal: 'Blu-gjelber', magenta: 'Magenta', indigo: 'Indigo',
  khaki: 'Kaki', olive: 'Ulliri', tan: 'Tan',
};

const FuelNames = {
  nafte: 'Naftë', benzin: 'Benzin', elektrike: 'Elektrike', hybrid: 'Hybrid',
};

const TransNames = {
  manual: 'Manual', automatic: 'Automatik',
  'semi-automatic': 'Semi-auto', tiptronic: 'Tiptronic',
};

const PRICE_CONFIG = {
  RENTAL: { label: 'Cmimi (€/Dite)', min: 15, max: 200 },
  SALE:   { label: 'Cmimi (€)',       min: 3000, max: 200000 },
};

const currentYear = new Date().getFullYear();

export default function Sidebar({
  filters = {},
  onFilterChange = () => {},
  activeFilters = {},
  showType = false,
  fixedType = null,
}) {
  const minYear = 1950;
  const maxYear = currentYear;

  const [, setYearRange]         = useState([1950, currentYear]);
  const [brandSearch, setBrandSearch]       = useState('');
  const [colorSearch, setColorSearch]       = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    setYearRange([activeFilters.yearMin, activeFilters.yearMax]);
  }, [activeFilters.yearMin, activeFilters.yearMax]);

  const toggle = (key, value) => {
    const current = activeFilters[key] ? activeFilters[key].split(',') : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, updated.length ? updated.join(',') : '');
  };

  const isActive = (key, value) => {
    const current = activeFilters[key] ? activeFilters[key].split(',') : [];
    return current.includes(value);
  };

  const filteredBrands     = (filters.brands || []).filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredColors     = (filters.colors || []).filter((c) =>
    (ColorNames[c] || '').toLowerCase().includes(colorSearch.toLowerCase()) ||
    c.toLowerCase().includes(colorSearch.toLowerCase())
  );
  const filteredCategories = (filters.categories || []).filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const priceConfig = fixedType
    ? PRICE_CONFIG[fixedType]
    : showType
      ? PRICE_CONFIG[activeFilters.type]
      : null;

  return (
    <aside id="sidebar">
      <h2>Filtrat</h2>

      {showType && (
        <FilterSection title="Tipi">
          <div className="carType">
            {['RENTAL', 'SALE'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  const next = activeFilters.type === t ? '' : t;
                  onFilterChange('type', next);
                  onFilterChange('minPrice', '');
                  onFilterChange('maxPrice', '');
                }}
                className={`chip ${activeFilters.type === t ? 'active' : ''}`}
              >
                {t === 'RENTAL' ? 'Qera' : 'Shitje'}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {priceConfig && (
        <FilterSection title={priceConfig.label}>
          <div className="price">
            <input
              type="number"
              placeholder={`Min ${priceConfig.min}`}
              min={priceConfig.min}
              max={priceConfig.max}
              value={activeFilters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="number half"
            />
            <input
              type="number"
              placeholder={`Max ${priceConfig.max.toLocaleString()}`}
              min={priceConfig.min}
              max={priceConfig.max}
              value={activeFilters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="number half"
            />
          </div>
        </FilterSection>
      )}

      <FilterSection title="Viti">
        <div className="price">
          <input
            type="number"
            placeholder={`Min ${minYear}`}
            min={minYear}
            max={maxYear}
            value={activeFilters.yearMin || ''}
            onChange={(e) => onFilterChange('yearMin', e.target.value)}
            className="number half"
          />
          <input
            type="number"
            placeholder={`Max ${maxYear}`}
            min={minYear}
            max={maxYear}
            value={activeFilters.yearMax || ''}
            onChange={(e) => onFilterChange('yearMax', e.target.value)}
            className="number half"
          />
        </div>
      </FilterSection>

      <FilterSection title="Kategoria">
        <input
          type="text"
          placeholder="Kerko kategori..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="input"
        />
        <div className="scrollWrap">
          {filteredCategories.map((c) => (
            <button
              key={c}
              onClick={() => toggle('category', c)}
              className={`chip ${isActive('category', c) ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Marka">
        <input
          type="text"
          placeholder="Kerko marke..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="input"
        />
        <div className="scrollWrap">
          {filteredBrands.map((b) => (
            <button
              key={b}
              onClick={() => toggle('brand', b)}
              className={`chip ${isActive('brand', b) ? 'active' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Karburanti">
        <div className="scrollWrap">
          {(filters.fuels || []).map((f) => (
            <button
              key={f}
              onClick={() => toggle('fuel', f)}
              className={`chip ${isActive('fuel', f) ? 'active' : ''}`}
            >
              {FuelNames[f] || f}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmisioni">
        <div className="scrollWrap">
          {(filters.transmissions || []).map((t) => (
            <button
              key={t}
              onClick={() => toggle('transmission', t)}
              className={`chip ${isActive('transmission', t) ? 'active' : ''}`}
            >
              {TransNames[t] || t}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Ulëset">
        <div className="scrollWrap">
          {(filters.seats || []).map((s) => (
            <button
              key={s}
              onClick={() => toggle('seats', String(s))}
              className={`chip ${isActive('seats', String(s)) ? 'active' : ''}`}
            >
              {s} ulëse
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dyert">
        <div className="scrollWrap">
          {[2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => toggle('doors', String(d))}
              className={`chip ${isActive('doors', String(d)) ? 'active' : ''}`}
            >
              {d} dyer
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Ngjyra">
        <input
          type="text"
          placeholder="Kerko ngjyre..."
          value={colorSearch}
          onChange={(e) => setColorSearch(e.target.value)}
          className="input"
        />
        <div className="colors">
          {filteredColors.map((c) => (
            <div
              key={c}
              title={ColorNames[c] || c}
              onClick={() => toggle('color', c)}
              className="colorItem"
            >
              <div
                className={`colorCircle ${isActive('color', c) ? 'active' : ''}`}
                style={{ background: ColorMap[c] || c }}
              />
              <span>{ColorNames[c] || c}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => {
          onFilterChange('__reset__', '');
          setBrandSearch('');
          setColorSearch('');
          setCategorySearch('');
          setYearRange([minYear, maxYear]);
        }}
        className="reset"
      >
        Fshi te gjithe filtrat
      </button>
    </aside>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="section">
      <p className="sectionTitle">{title}</p>
      {children}
    </div>
  );
}