import React, { useState } from "react";
import "../buy/buy.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import API from "../../pages/auth/api";

// ── Enum vlerat nga tabela cars ──────────────────────────────
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

const FUELS = [
  { value: "nafte",     label: "Naftë (Diesel)" },
  { value: "benzin",    label: "Benzinë" },
  { value: "elektrike", label: "Elektrike" },
  { value: "hybrid",    label: "Hybrid" },
];

const TRANSMISSIONS = [
  { value: "manual",         label: "Manual" },
  { value: "automatic",      label: "Automatik" },
  { value: "semi-automatic", label: "Semi-automatik" },
  { value: "tiptronic",      label: "Tiptronic" },
];

const COLORS = [
  { value: "black",   label: "E zezë" },
  { value: "white",   label: "E bardhë" },
  { value: "grey",    label: "Gri" },
  { value: "silver",  label: "Argjendtë" },
  { value: "red",     label: "E kuqe" },
  { value: "blue",    label: "Blu" },
  { value: "green",   label: "Jeshile" },
  { value: "yellow",  label: "Verdhë" },
  { value: "orange",  label: "Portokalli" },
  { value: "brown",   label: "Kafe" },
  { value: "beige",   label: "Bezhë" },
  { value: "gold",    label: "Ari" },
  { value: "purple",  label: "Vjollcë" },
  { value: "pink",    label: "Rozë" },
  { value: "maroon",  label: "Gështenjë" },
  { value: "navy",    label: "Blu i errët" },
  { value: "pearl",   label: "Perlë" },
  { value: "cream",   label: "Kremë" },
  { value: "bronze",  label: "Bronzi" },
  { value: "tan",     label: "Tan" },
];

const INITIAL_FORM = {
  brand: "", model: "", year: "", mileage: "",
  fuel: "", transmission: "", color: "",
  condition: "", asking_price: "",
  name: "", phone: "", city: "",
};

// ── Field jashtë Buy — kjo është rregullimi i problemit ──────
const Field = ({ error, children }) => (
  <div className="form-group">
    {children}
    {error && <span className="form-error">{error}</span>}
  </div>
);

export default function Buy() {
  const [form, setForm]               = useState(INITIAL_FORM);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.brand)            e.brand        = "Zgjidh markën";
    if (!form.model.trim())     e.model        = "Shkruaj modelin";
    if (!form.year)             e.year         = "Shkruaj vitin";
    if (!form.mileage)          e.mileage      = "Shkruaj kilometrat";
    if (!form.fuel)             e.fuel         = "Zgjidh karburantin";
    if (!form.transmission)     e.transmission = "Zgjidh transmisionin";
    if (!form.name.trim())      e.name         = "Shkruaj emrin";
    if (!form.phone.trim())     e.phone        = "Shkruaj telefonin";
    if (!form.city.trim())      e.city         = "Shkruaj qytetin";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    try {
      await API.post("/sell-requests/post", {
        ...form,
        year:         parseInt(form.year),
        mileage:      parseInt(form.mileage),
        asking_price: form.asking_price ? parseInt(form.asking_price) : null,
      });

      setSuccess(true);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || "Gabim. Provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navigimi />
        <section className="sell-page">
          <div className="sell-success">
            <div className="sell-success__icon">✓</div>
            <h2>Kërkesa u dërgua!</h2>
            <p>Do t'ju kontaktojmë brenda 24 orësh.</p>
            <button className="sell-btn" onClick={() => setSuccess(false)}>
              Dërgo kërkesë tjetër
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigimi />
      <section className="sell-page">

        <header className="sell-header">
          <h1>Shes makinën time</h1>
          <p>Vlerësim falas · Pagesë e shpejtë · Pa ndërmjetës</p>
        </header>

        <div className="sell-steps">
          <div className="step"><span>1</span><p>Plotëso të dhënat</p></div>
          <div className="step"><span>2</span><p>Ju kontaktojmë</p></div>
          <div className="step"><span>3</span><p>Blerje e menjëhershme</p></div>
        </div>

        <form className="sell-form" onSubmit={handleSubmit} noValidate>
          <h2>Të dhënat e automjetit</h2>

          <Field error={errors.brand}>
            <label>Marka *</label>
            <select value={form.brand} onChange={handleChange("brand")}>
              <option value="">-- Zgjidh markën --</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.model}>
            <label>Modeli *</label>
            <input
              type="text"
              value={form.model}
              onChange={handleChange("model")}
              placeholder="p.sh. X5, A4, Golf..."
            />
          </Field>

          <div className="form-row">
            <Field error={errors.year}>
              <label>Viti *</label>
              <input
                type="number"
                value={form.year}
                onChange={handleChange("year")}
                placeholder="2020"
                min="1950"
                max={new Date().getFullYear()}
              />
            </Field>
            <Field error={errors.mileage}>
              <label>Kilometra *</label>
              <input
                type="number"
                value={form.mileage}
                onChange={handleChange("mileage")}
                placeholder="150000"
                min="0"
              />
            </Field>
          </div>

          <div className="form-row">
            <Field error={errors.fuel}>
              <label>Karburanti *</label>
              <select value={form.fuel} onChange={handleChange("fuel")}>
                <option value="">-- Zgjidh --</option>
                {FUELS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>
            <Field error={errors.transmission}>
              <label>Transmisioni *</label>
              <select value={form.transmission} onChange={handleChange("transmission")}>
                <option value="">-- Zgjidh --</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field error={errors.color}>
            <label>Ngjyra</label>
            <select value={form.color} onChange={handleChange("color")}>
              <option value="">-- Zgjidh ngjyrën --</option>
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          <Field error={errors.asking_price}>
            <label>Çmimi i kërkuar (€)</label>
            <input
              type="number"
              value={form.asking_price}
              onChange={handleChange("asking_price")}
              placeholder="p.sh. 15000"
              min="0"
            />
          </Field>

          <Field error={errors.condition}>
            <label>Gjendja / Defekte</label>
            <textarea
              value={form.condition}
              onChange={handleChange("condition")}
              placeholder="Përshkruani shkurt gjendjen e makinës..."
              rows={3}
            />
          </Field>

          <h2>Kontakt</h2>

          <Field error={errors.name}>
            <label>Emri *</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Emri juaj"
            />
          </Field>

          <Field error={errors.phone}>
            <label>Telefoni *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+355..."
            />
          </Field>

          <Field error={errors.city}>
            <label>Qyteti *</label>
            <input
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              placeholder="Tiranë"
            />
          </Field>

          {serverError && <p className="form-server-error">{serverError}</p>}

          <button type="submit" className="sell-btn" disabled={loading}>
            {loading ? "Duke dërguar..." : "Dërgo për vlerësim"}
          </button>
        </form>

        <div className="sell-guarantees">
          <span>Pa detyrim shitjeje</span>
          <span>Të dhënat ruhen private</span>
          <span>Përgjigje brenda 24 orësh</span>
        </div>

      </section>
      <Footer />
    </>
  );
}