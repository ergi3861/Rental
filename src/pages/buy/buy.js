import React, { useState } from 'react';
import '../buy/buy.css';
import Navigimi from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import API from '../../backendConnection/api';
import { useAuth } from '../../backendConnection/context';
import { useNavigate } from 'react-router-dom';

const brands = [
  'alfa romeo', 'aston martin', 'audi', 'bentley', 'bmw', 'bugatti', 'byd',
  'cadillac', 'chevrolet', 'chrysler', 'citroen', 'corvete', 'dacia', 'daimler',
  'dodge', 'ferrari', 'fiat', 'ford', 'genesis', 'gmc', 'honda', 'hummer',
  'hyundai', 'infiniti', 'iveco', 'jaguar', 'jeep', 'kia', 'koenigsegg', 'lada',
  'lamborghini', 'lancia', 'land rover', 'lexus', 'lincoln', 'maserati', 'maybach',
  'mazda', 'mclaren', 'mercedes benz', 'mg', 'mini cooper', 'mitsubishi', 'nissan',
  'opel', 'pagani', 'peugot', 'polestar', 'porsche', 'proton', 'renault',
  'rolls royce', 'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla',
  'toyota', 'volkswagen', 'volvo',
];

const fuels = [
  { value: 'nafte',         label: 'Naftë (Diesel)' },
  { value: 'benzin',        label: 'Benzinë' },
  { value: 'elektrike',     label: 'Elektrike' },
  { value: 'hybrid',        label: 'Hybrid' },
];

const transmissions = [
  { value: 'manual',         label: 'Manual' },
  { value: 'automatic',      label: 'Automatik' },
  { value: 'semi-automatic', label: 'Semi-automatik' },
  { value: 'tiptronic',      label: 'Tiptronic' },
];

const colors = [
  { value: 'black',  label: 'E zezë' },
  { value: 'white',  label: 'E bardhë' },
  { value: 'grey',   label: 'Gri' },
  { value: 'silver', label: 'Argjendtë' },
  { value: 'red',    label: 'E kuqe' },
  { value: 'blue',   label: 'Blu' },
  { value: 'green',  label: 'Jeshile' },
  { value: 'yellow', label: 'Verdhë' },
  { value: 'orange', label: 'Portokalli' },
  { value: 'brown',  label: 'Kafe' },
  { value: 'beige',  label: 'Bezhë' },
  { value: 'gold',   label: 'Ari' },
  { value: 'purple', label: 'Vjollcë' },
  { value: 'pink',   label: 'Rozë' },
  { value: 'maroon', label: 'Gështenjë' },
  { value: 'navy',   label: 'Blu i errët' },
  { value: 'pearl',  label: 'Perlë' },
  { value: 'cream',  label: 'Kremë' },
  { value: 'bronze', label: 'Bronzi' },
  { value: 'tan',    label: 'Tan' },
];

const initialForm = {
  brand: '', model: '', year: '', mileage: '',
  fuel: '', transmission: '', color: '', condition: '',
  asking_price: '', name: '', phone: '', city: '',
};

const Field = ({ error, children }) => (
  <div className="formGroup">
    {children}
    {error && <span className="formError">{error}</span>}
  </div>
);

function LoginPopup({ onClose, onLogin }) {
  return (
    <div className="loginPopupOverlay" onClick={onClose}>
      <div className="loginPopup" onClick={(e) => e.stopPropagation()}>
        <button className="loginPopupClose" onClick={onClose}>✕</button>
        <div className="loginPopupIcon">🔐</div>
        <h3 className="loginPopupTitle">Kërkohet Hyrja</h3>
        <p className="loginPopupSub">
          Duhet të jeni të kyçur për të dërguar një kërkesë shitjeje.
        </p>
        <button className="loginPopupBtn" onClick={onLogin}>
          Hyr në llogari →
        </button>
        <p className="loginPopupRegister">
          Nuk keni llogari?{' '}
          <span className="loginPopupLink" onClick={onLogin}>
            Regjistrohu falas
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Sell() {
  // ✅ Shto loading nga useAuth
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form,        setForm]        = useState(initialForm);
  const [photos,      setPhotos]      = useState([]);
  const [previews,    setPreviews]    = useState([]);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [serverError, setServerError] = useState('');
  const [showLogin,   setShowLogin]   = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev)   => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!form.brand)        e.brand        = 'Zgjidh markën';
    if (!form.model.trim()) e.model        = 'Shkruaj modelin';
    if (!form.year)         e.year         = 'Shkruaj vitin';
    if (!form.mileage)      e.mileage      = 'Shkruaj kilometrat';
    if (!form.fuel)         e.fuel         = 'Zgjidh karburantin';
    if (!form.transmission) e.transmission = 'Zgjidh transmisionin';
    if (!form.name.trim())  e.name         = 'Shkruaj emrin';
    if (!form.phone.trim()) e.phone        = 'Shkruaj telefonin';
    if (!form.city.trim())  e.city         = 'Shkruaj qytetin';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prit derisa auth të jetë gati
    if (authLoading) return;

    // ✅ Nëse nuk është i loguar → popup
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('brand',        form.brand);
      formData.append('model',        form.model);
      formData.append('year',         parseInt(form.year));
      formData.append('mileage',      parseInt(form.mileage));
      formData.append('fuel',         form.fuel);
      formData.append('transmission', form.transmission);
      formData.append('color',        form.color);
      formData.append('condition',    form.condition);
      formData.append('name',         form.name);
      formData.append('phone',        form.phone);
      formData.append('city',         form.city);
      if (form.asking_price) formData.append('asking_price', parseInt(form.asking_price));
      photos.forEach((file) => formData.append('photos', file));

      await API.post('/sell-requests/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      previews.forEach((url) => URL.revokeObjectURL(url));
      setSuccess(true);
      setForm(initialForm);
      setPhotos([]);
      setPreviews([]);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || 'Gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setShowLogin(false);
    navigate('/auth');
  };

  // ── Ekrani i suksesit ─────────────────────────────────────
  if (success) {
    return (
      <div id="sellRequest">
        <Navigimi />
        <section className="sellPage">
          <div className="sellSuccess">
            <div className="sellSuccessIcon">✓</div>
            <h2>Kërkesa u dërgua!</h2>
            <p>Do t'ju kontaktojmë brenda 24 orësh.</p>
            <button className="sellBtn" onClick={() => setSuccess(false)}>
              Dërgo kërkesë tjetër
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navigimi />

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onLogin={goToLogin}
        />
      )}

      <div id="sell">
        <section className="sellPage">
          <header className="sellHeader">
            <h1>Shes makinën time</h1>
            <p>Vlerësim falas · Pagesë e shpejtë · Pa ndërmjetës</p>
          </header>

          <div className="sellSteps">
            <div className="step"><span>1</span><p>Plotëso të dhënat</p></div>
            <div className="step"><span>2</span><p>Ju kontaktojmë</p></div>
            <div className="step"><span>3</span><p>Blerje e menjëhershme</p></div>
          </div>

          <form className="sellForm" onSubmit={handleSubmit} noValidate>
            <h2>Të dhënat e automjetit</h2>

            <Field error={errors.brand}>
              <label>Marka *</label>
              <select value={form.brand} onChange={handleChange('brand')}>
                <option value="">-- Zgjidh markën --</option>
                {brands.map((b) => (
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
                onChange={handleChange('model')}
                placeholder="p.sh. X5, A4, Golf..."
              />
            </Field>

            <div className="formRow">
              <Field error={errors.year}>
                <label>Viti *</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={handleChange('year')}
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
                  onChange={handleChange('mileage')}
                  placeholder="Psh: 150000"
                  min="0"
                />
              </Field>
            </div>

            <div className="formRow">
              <Field error={errors.fuel}>
                <label>Karburanti *</label>
                <select value={form.fuel} onChange={handleChange('fuel')}>
                  <option value="">-- Zgjidh --</option>
                  {fuels.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </Field>
              <Field error={errors.transmission}>
                <label>Transmisioni *</label>
                <select value={form.transmission} onChange={handleChange('transmission')}>
                  <option value="">-- Zgjidh --</option>
                  {transmissions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field error={errors.color}>
              <label>Ngjyra</label>
              <select value={form.color} onChange={handleChange('color')}>
                <option value="">-- Zgjidh ngjyrën --</option>
                {colors.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field error={errors.asking_price}>
              <label>Çmimi i kërkuar (€)</label>
              <input
                type="number"
                value={form.asking_price}
                onChange={handleChange('asking_price')}
                placeholder="p.sh. 15000"
                min="0"
              />
            </Field>

            <Field error={errors.condition}>
              <label>Gjendja / Defekte</label>
              <textarea
                value={form.condition}
                onChange={handleChange('condition')}
                placeholder="Përshkruani shkurt gjendjen e makinës..."
                rows={3}
              />
            </Field>

            <Field error={errors.photos}>
              <label>Fotografi të makinës (max 10)</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} />
              {photos.length > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {photos.length} foto të zgjedhura
                </span>
              )}
            </Field>

            {previews.length > 0 && (
              <div className="photoPreviewGrid">
                {previews.map((url, i) => (
                  <div key={i} className="photoPreviewItem">
                    <img src={url} alt={`foto-${i + 1}`} />
                    <button
                      type="button"
                      className="photoRemoveBtn"
                      onClick={() => removePhoto(i)}
                      title="Hiq foton"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <h2>Kontakt</h2>

            <Field error={errors.name}>
              <label>Emri *</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Emri juaj"
              />
            </Field>

            <Field error={errors.phone}>
              <label>Telefoni *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+355..."
              />
            </Field>

            <Field error={errors.city}>
              <label>Qyteti *</label>
              <input
                type="text"
                value={form.city}
                onChange={handleChange('city')}
                placeholder="Tiranë"
              />
            </Field>

            {serverError && <p className="form-server-error">{serverError}</p>}

            <button type="submit" className="sellBtn" disabled={loading || authLoading}>
              {authLoading ? 'Duke u ngarkuar...' : loading ? 'Duke dërguar...' : 'Dërgo për vlerësim'}
            </button>
          </form>

          <div className="sellGuarantees">
            <span>Pa detyrim shitjeje</span>
            <span>Të dhënat ruhen private</span>
            <span>Përgjigje brenda 24 orësh</span>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}