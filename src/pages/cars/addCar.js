import { useState } from "react";
import API from "../auth/api";
import "./cars.css";

const BRANDS = [
  "alfa romeo","aston martin","audi","bentley","bmw","bugatti","byd",
  "cadillac","chevrolet","chrysler","citroen","corvete","dacia","daimler",
  "dodge","ferrari","fiat","ford","genesis","gmc","honda","hummer",
  "hyundai","infiniti","iveco","jaguar","jeep","kia","koenigsegg","lada",
  "lamborghini","lancia","land rover","lexus","lincoln","maserati","maybach",
  "mazda","mclaren","mercedes benz","mg","mini cooper","mitsubishi","nissan",
  "opel","pagani","peugot","polestar","porsche","proton","renault",
  "rolls royce","saab","seat","skoda","smart","subaru","suzuki","tesla",
  "toyota","volkswagen","volvo",
];

const INITIAL = {
  type: "RENTAL", brand: "", model: "", vin: "",
  category: "SUV", year: "", fuel: "nafte",
  transmission: "manual", color: "black",
  seats: "5", price_per_day: "", sale_price: "", status: "available",
};

const Field = ({ error, children }) => (
  <div className="ac-field">
    {children}
    {error && <span className="ac-error">{error}</span>}
  </div>
);

export default function AddCar() {
  const [form, setForm]         = useState(INITIAL);
  const [images, setImages]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [serverError, setServerError] = useState("");

  const set = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    setErrors(p => ({ ...p, [f]: undefined }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const e = {};
    if (!form.brand)       e.brand = "Kërkohet";
    if (!form.model.trim()) e.model = "Kërkohet";
    if (!form.vin.trim())  e.vin   = "Kërkohet";
    if (!form.year)        e.year  = "Kërkohet";
    if (form.type === "RENTAL" && !form.price_per_day) e.price_per_day = "Kërkohet për qira";
    if (form.type === "SALE"   && !form.sale_price)    e.sale_price    = "Kërkohet për shitje";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    setSuccess("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append("images", img));

      const res = await API.post("/cars", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess(`✅ Makina u shtua me ID #${res.data.carId}`);
      setForm(INITIAL);
      setImages([]);
      setPreviews([]);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || "Gabim. Provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ac-page">
      <div className="ac-header">
        <h1>Shto Makinë</h1>
        <p>Plotëso të dhënat dhe ngarko fotot</p>
      </div>

      <form className="ac-form" onSubmit={handleSubmit} noValidate>

        {/* Tipi */}
        <div className="ac-type-toggle">
          {["RENTAL", "SALE"].map(t => (
            <button
              type="button" key={t}
              className={`ac-type-btn ${form.type === t ? "active" : ""}`}
              onClick={() => setForm(p => ({ ...p, type: t }))}
            >
              {t === "RENTAL" ? "🚗 Qira" : "🤝 Shitje"}
            </button>
          ))}
        </div>

        <div className="ac-grid">
          {/* Marka */}
          <Field error={errors.brand}>
            <label>Marka *</label>
            <select value={form.brand} onChange={set("brand")}>
              <option value="">-- Zgjidh --</option>
              {BRANDS.map(b => (
                <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
              ))}
            </select>
          </Field>

          {/* Modeli */}
          <Field error={errors.model}>
            <label>Modeli *</label>
            <input value={form.model} onChange={set("model")} placeholder="p.sh. X5, A4..." />
          </Field>

          {/* VIN */}
          <Field error={errors.vin}>
            <label>VIN *</label>
            <input value={form.vin} onChange={set("vin")} placeholder="17 karaktere" maxLength={17} />
          </Field>

          {/* Viti */}
          <Field error={errors.year}>
            <label>Viti *</label>
            <input type="number" value={form.year} onChange={set("year")}
              placeholder="2023" min="1950" max={new Date().getFullYear()} />
          </Field>

          {/* Kategoria */}
          <Field>
            <label>Kategoria</label>
            <select value={form.category} onChange={set("category")}>
              {["Ekonomike","Kompakt","SUV","Luksoze","Elektrike","Hibride"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          {/* Karburanti */}
          <Field>
            <label>Karburanti</label>
            <select value={form.fuel} onChange={set("fuel")}>
              <option value="nafte">Naftë</option>
              <option value="benzin">Benzinë</option>
              <option value="elektrike">Elektrike</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </Field>

          {/* Transmisioni */}
          <Field>
            <label>Transmisioni</label>
            <select value={form.transmission} onChange={set("transmission")}>
              <option value="manual">Manual</option>
              <option value="automatic">Automatik</option>
              <option value="semi-automatic">Semi-automatik</option>
              <option value="tiptronic">Tiptronic</option>
            </select>
          </Field>

          {/* Ngjyra */}
          <Field>
            <label>Ngjyra</label>
            <select value={form.color} onChange={set("color")}>
              {["black","white","grey","silver","red","blue","green","yellow",
                "orange","brown","beige","gold","purple","pink","navy","pearl","cream"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          {/* Ulëset */}
          <Field>
            <label>Ulëset</label>
            <select value={form.seats} onChange={set("seats")}>
              {[2,4,5,6,7,8,9,10,12,15].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          {/* Statusi */}
          <Field>
            <label>Statusi</label>
            <select value={form.status} onChange={set("status")}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="service">Service</option>
            </select>
          </Field>

          {/* Çmimi qira */}
          {form.type === "RENTAL" && (
            <Field error={errors.price_per_day}>
              <label>Çmimi / ditë (€) *</label>
              <input type="number" value={form.price_per_day}
                onChange={set("price_per_day")} placeholder="p.sh. 45" min="0" />
            </Field>
          )}

          {/* Çmimi shitje */}
          {form.type === "SALE" && (
            <Field error={errors.sale_price}>
              <label>Çmimi shitje (€) *</label>
              <input type="number" value={form.sale_price}
                onChange={set("sale_price")} placeholder="p.sh. 25000" min="0" />
            </Field>
          )}
        </div>

        {/* Upload imazhe */}
        <div className="ac-images-section">
          <label className="ac-upload-label">
            <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
            <div className="ac-upload-box">
              <span className="ac-upload-icon">📷</span>
              <span>Kliko për të ngarkuar foto (max 10)</span>
              <span className="ac-upload-hint">JPG, PNG, WEBP · max 5MB secila</span>
            </div>
          </label>

          {previews.length > 0 && (
            <div className="ac-previews">
              {previews.map((src, i) => (
                <div className="ac-preview" key={i}>
                  <img src={src} alt={`foto-${i}`} />
                  <button type="button" className="ac-remove" onClick={() => removeImage(i)}>✕</button>
                  {i === 0 && <span className="ac-main-badge">Kryesore</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {serverError && <p className="ac-server-error">{serverError}</p>}
        {success     && <p className="ac-success">{success}</p>}

        <button type="submit" className="ac-submit" disabled={loading}>
          {loading ? "Duke ngarkuar..." : "Shto Makinën"}
        </button>
      </form>
    </div>
  );
}