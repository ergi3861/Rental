import { useEffect, useState } from "react";
import "./filter.css";

const COLOR_MAP = {
  black: "#111", white: "#f9f9f9", grey: "#888", silver: "#C0C0C0",
  red: "#e53e3e", blue: "#3182ce", green: "#38a169", yellow: "#ECC94B",
  orange: "#ED8936", brown: "#744210", beige: "#F5F0DC", gold: "#D4AF37",
  purple: "#805AD5", pink: "#ED64A6", violet: "#6B46C1", maroon: "#800000",
  cyan: "#00BCD4", turquoise: "#40E0D0", navy: "#001F5B", lime: "#84CC16",
  bronze: "#CD7F32", cream: "#FFFDD0", pearl: "#EAE0C8", cherry: "#DE3163",
  mint: "#98FF98", teal: "#008080", magenta: "#FF00FF", indigo: "#4B0082",
  khaki: "#C3B091", olive: "#808000", tan: "#D2B48C",
};

const COLOR_NAMES_AL = {
  black: "E zeze", white: "E bardhe", grey: "Gri", silver: "Argjente",
  red: "E kuqe", blue: "Blu", green: "E gjelber", yellow: "E verdhe",
  orange: "Portokalli", brown: "Kafe", beige: "Bezhe", gold: "Ari",
  purple: "Vjollce", pink: "Roze", violet: "Violet", maroon: "Geshtenje",
  cyan: "Cian", turquoise: "Turkez", navy: "Blu detare", lime: "Gelberim",
  bronze: "Bronz", cream: "Kreme", pearl: "Perle", cherry: "Qershi",
  mint: "Mente", teal: "Blu-gjelber", magenta: "Magenta", indigo: "Indigo",
  khaki: "Kaki", olive: "Ulliri", tan: "Tan",
};

const CURRENT_YEAR = new Date().getFullYear();

export default function Sidebar({ filters = {}, onFilterChange = () => {}, activeFilters = {} }) {
  const minYear = 1950;
  const maxYear = CURRENT_YEAR;

  const [yearRange, setYearRange] = useState([1950, CURRENT_YEAR]);
  const [brandSearch, setBrandSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    setYearRange([
      activeFilters.year_min || minYear,
      activeFilters.year_max || maxYear,
    ]);
  }, [minYear, maxYear]);

  const toggle = (key, value) => {
    const current = activeFilters[key] ? activeFilters[key].split(",") : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, updated.length ? updated.join(",") : "");
  };

  const isActive = (key, value) => {
    const current = activeFilters[key] ? activeFilters[key].split(",") : [];
    return current.includes(value);
  };

  const filteredBrands = (filters.brands || []).filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredColors = (filters.colors || []).filter((c) =>
    (COLOR_NAMES_AL[c] || "").toLowerCase().includes(colorSearch.toLowerCase()) ||
    c.toLowerCase().includes(colorSearch.toLowerCase())
  );
  const filteredCategories = (filters.categories || []).filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <h2 className="title">Filtrat</h2>

      <FilterSection title="Tipi">
        <div className="flex-wrap">
          {["RENTAL", "SALE"].map((t) => (
            <button
              key={t}
              onClick={() => onFilterChange("type", activeFilters.type === t ? "" : t)}
              className={`chip ${activeFilters.type === t ? "active" : ""}`}
            >
              {t === "RENTAL" ? "Qira" : "Shitje"}
            </button>
          ))}
        </div>
      </FilterSection>

      {activeFilters.type && (
        <FilterSection title={`Cmimi ${activeFilters.type === "RENTAL" ? "(euro/dite)" : "(euro)"}`}>
          <div className="flex">
            <input type="number" placeholder="Min" min={0}
              value={activeFilters.price_min || ""}
              onChange={(e) => onFilterChange("price_min", e.target.value)}
              className="number half" />
            <input type="number" placeholder="Max" min={0}
              value={activeFilters.price_max || ""}
              onChange={(e) => onFilterChange("price_max", e.target.value)}
              className="number half" />
          </div>
        </FilterSection>
      )}

      <FilterSection title="Kategoria">
        <input type="text" placeholder="Kerko kategori..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="input" />
        <div className="scroll-wrap">
          {filteredCategories.map((c) => (
            <button key={c}
              onClick={() => toggle("category", c)}
              className={`chip ${isActive("category", c) ? "active" : ""}`}>
              {c}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Marka">
        <input type="text" placeholder="Kerko marke..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="input" />
        <div className="scroll-wrap">
          {filteredBrands.map((b) => (
            <button key={b}
              onClick={() => toggle("brand", b)}
              className={`chip ${isActive("brand", b) ? "active" : ""}`}>
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Ngjyra">
        <input type="text" placeholder="Kerko ngjyre..."
          value={colorSearch}
          onChange={(e) => setColorSearch(e.target.value)}
          className="input" />
        <div className="colors">
          {filteredColors.map((c) => (
            <div key={c}
              title={COLOR_NAMES_AL[c] || c}
              onClick={() => toggle("color", c)}
              className="color-item">
              <div
                className={`color-circle ${isActive("color", c) ? "active" : ""}`}
                style={{ background: COLOR_MAP[c] || c }}
              />
              <span>{COLOR_NAMES_AL[c] || c}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => {
          onFilterChange("__reset__", "");
          setBrandSearch("");
          setColorSearch("");
          setCategorySearch("");
          setYearRange([minYear, maxYear]);
        }}
        className="reset"
      >
        Fshi te gjitha filtrat
      </button>
    </aside>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="section">
      <p className="section-title">{title}</p>
      {children}
    </div>
  );
}