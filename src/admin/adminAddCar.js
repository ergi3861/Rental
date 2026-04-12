import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ADMIN_API from '../admin/adminAPI';
import '../admin/admin.css';

const brands = [
  'alfa romeo',
  'aston martin',
  'audi',
  'bentley',
  'bmw',
  'bugatti',
  'byd',
  'cadillac',
  'chevrolet',
  'chrysler',
  'citroen',
  'corvete',
  'dacia',
  'daimler',
  'dodge',
  'ferrari',
  'fiat',
  'ford',
  'genesis',
  'gmc',
  'honda',
  'hummer',
  'hyundai',
  'infiniti',
  'iveco',
  'jaguar',
  'jeep',
  'kia',
  'koenigsegg',
  'lada',
  'lamborghini',
  'lancia',
  'land rover',
  'lexus',
  'lincoln',
  'maserati',
  'maybach',
  'mazda',
  'mclaren',
  'mercedes benz',
  'mg',
  'mini cooper',
  'mitsubishi',
  'nissan',
  'opel',
  'pagani',
  'peugot',
  'polestar',
  'porsche',
  'proton',
  'renault',
  'rolls royce',
  'saab',
  'seat',
  'skoda',
  'smart',
  'subaru',
  'suzuki',
  'tesla',
  'toyota',
  'volkswagen',
  'volvo',
];

const Initial = {
  type: 'RENTAL',
  brand: '',
  model: '',
  vin: '',
  category: 'SUV',
  year: '',
  fuel: 'nafte',
  transmission: 'manual',
  color: 'black',
  seats: '5',
  price_per_day: '',
  sale_price: '',
  status: 'available',
};

const Field = ({ label, error, required, children, span }) => (
  <div className={`addCarField ${span ? `addCarFieldSpan-${span}` : ''}`}>
    <label className="addCarLabel">
      {label}
      {required && <span className="addCarRequired">*</span>}
    </label>
    {children}
    {error && <span className="addCarErrorMsg">{error}</span>}
  </div>
);

const steps = ['Lloji & Identifikimi', 'Specifikimet e makines', 'Çmimi & Statusi', 'Fotot'];

export default function AddCar() {
  const navigate = useNavigate();

  const [form, setForm] = useState(Initial);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [step, setStep] = useState(0);

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previews[i]);
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.brand) e.brand = 'Kërkohet';
      if (!form.model.trim()) e.model = 'Kërkohet';
      if (!form.vin.trim()) e.vin = 'Kërkohet (17 karaktere)';
      if (!form.year) e.year = 'Kërkohet';
    }
    if (s === 2) {
      if (form.type === 'RENTAL' && !form.price_per_day) e.price_per_day = 'Kërkohet për qira';
      if (form.type === 'SALE' && !form.sale_price) e.sale_price = 'Kërkohet për shitje';
    }
    return e;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors('gabim');
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = { ...validateStep(0), ...validateStep(3) };
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');
    setSuccess('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
      images.forEach((img) => fd.append('images', img));

      const res = await ADMIN_API.post('/cars', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(`Makina u shtua me sukses! ID #${res.data.carId}`);
      previews.forEach((u) => URL.revokeObjectURL(u));
      setForm(Initial);
      setImages([]);
      setPreviews([]);
      setErrors({});
      setStep(0);

      setTimeout(() => navigate('/admin/cars'), 1500);
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.response?.data?.error || 'Gabim gjatë shtimit.'
      );
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = step === steps.length - 1;

  return (
    <div id="addCarPage">
      <div className="addCarHeader">
        <div className="addCarHeaderLeft">
          <button className="addCarBack" onClick={() => navigate('/admin/cars')}>
            ← Kthehu
          </button>
          <div>
            <h1 className="addCarTitle">Shto Makinë të Re</h1>
            <p className="addCarSubtitle">Plotëso hapat për të shtuar makinën në sistem</p>
          </div>
        </div>
      </div>

      <div className="addCarStepper">
        {steps.map((label, i) => (
          <div
            key={i}
            className={`addCarStep ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => i < step && setStep(i)}
          >
            <div className="addCarStepCircle">{i < step ? '✓' : i + 1}</div>
            <span className="addCarStepLabel">{label}</span>
            {i < steps.length - 1 && <div className="addCarStepLine" />}
          </div>
        ))}
      </div>

      <form className="addCarForm" onSubmit={handleSubmit} noValidate>
        {step === 0 && (
          <div className="addCarSection addCarSectionAnimate">
            <div className="addCarSectionHeader">
              <span className="addCarSectionNum">01</span>
              <h2>Lloji &amp; Identifikimi</h2>
            </div>

            <div className="addCarTypeRow">
              {[
                { val: 'RENTAL', icon: '🚗', title: 'Qira', desc: 'Makinë për qiradhënie' },
                { val: 'SALE', icon: '🤝', title: 'Shitje', desc: 'Makinë për shitje' },
              ].map((t) => (
                <div
                  key={t.val}
                  className={`addCarTypeCard ${form.type === t.val ? 'active' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, type: t.val }))}
                >
                  <span className="addCarTypeCardIcon">{t.icon}</span>
                  <strong>{t.title}</strong>
                  <span>{t.desc}</span>
                </div>
              ))}
            </div>

            <div className="addCarGrid">
              <Field label="Marka" required error={errors.brand}>
                <select className="addCarInput" value={form.brand} onChange={set('brand')}>
                  <option value="">-- Zgjidhni markën --</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Modeli" required error={errors.model}>
                <input
                  className="addCarInput"
                  value={form.model}
                  onChange={set('model')}
                  placeholder="p.sh. X5, A4, Golf..."
                />
              </Field>

              <Field label="VIN" required error={errors.vin} span={2}>
                <input
                  className="addCarInput addCarInputMono"
                  value={form.vin}
                  onChange={set('vin')}
                  placeholder="17 karaktere (p.sh. WBA3A5C55DF357960)"
                  maxLength={17}
                />
                <span className="addCarHint">{form.vin.length}/17 karaktere</span>
              </Field>

              <Field label="Viti" required error={errors.year}>
                <input
                  className="addCarInput"
                  type="number"
                  value={form.year}
                  onChange={set('year')}
                  placeholder={new Date().getFullYear().toString()}
                  min="1950"
                  max={new Date().getFullYear()}
                />
              </Field>

              <Field label="Kategoria">
                <select className="addCarInput" value={form.category} onChange={set('category')}>
                  {['Ekonomike', 'Kompakt', 'SUV', 'Luksoze', 'Elektrike', 'Hibride'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="addCarSection addCarSectionAnimate">
            <div className="addCarSectionHeader">
              <span className="addCarSectionNum">02</span>
              <h2>Specifikimet Teknike</h2>
            </div>

            <div className="addCarGrid">
              <Field label="Karburanti">
                <select className="addCarInput" value={form.fuel} onChange={set('fuel')}>
                  <option value="nafte">⛽ Naftë (Diesel)</option>
                  <option value="benzin">⛽ Benzinë</option>
                  <option value="elektrike">⚡ Elektrike</option>
                  <option value="hybrid">🔋 Hybrid</option>
                </select>
              </Field>

              <Field label="Transmisioni">
                <select
                  className="addCarInput"
                  value={form.transmission}
                  onChange={set('transmission')}
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatik</option>
                  <option value="semi-automatic">Semi-automatik</option>
                  <option value="tiptronic">Tiptronic</option>
                </select>
              </Field>

              <Field label="Ngjyra">
                <div className="addCarColorGrid">
                  {[
                    { val: 'black', hex: '#1a1a1a', label: 'E zezë' },
                    { val: 'white', hex: '#f5f5f5', label: 'E bardhë' },
                    { val: 'grey', hex: '#6b7280', label: 'Gri' },
                    { val: 'silver', hex: '#c0c0c0', label: 'Argjendtë' },
                    { val: 'red', hex: '#dc2626', label: 'E kuqe' },
                    { val: 'blue', hex: '#2563eb', label: 'Blu' },
                    { val: 'green', hex: '#16a34a', label: 'Jeshile' },
                    { val: 'yellow', hex: '#ca8a04', label: 'Verdhë' },
                    { val: 'orange', hex: '#ea580c', label: 'Portokalli' },
                    { val: 'brown', hex: '#78350f', label: 'Kafe' },
                    { val: 'beige', hex: '#d4b896', label: 'Bezhë' },
                    { val: 'gold', hex: '#b7791f', label: 'Ari' },
                    { val: 'navy', hex: '#1e3a5f', label: 'Blu i errët' },
                    { val: 'pearl', hex: '#f0ede8', label: 'Perlë' },
                    { val: 'maroon', hex: '#7f1d1d', label: 'Gështenjë' },
                  ].map((c) => (
                    <div
                      key={c.val}
                      className={`addCarColorSwatch ${form.color === c.val ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.label}
                      onClick={() => setForm((p) => ({ ...p, color: c.val }))}
                    >
                      {form.color === c.val && <span className="addCarColorCheck">✓</span>}
                    </div>
                  ))}
                </div>
                <span className="addCarHint">Zgjedhur: {form.color}</span>
              </Field>

              <Field label="Ulëset">
                <div className="addCarSeatsGrid">
                  {[2, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((s) => (
                    <div
                      key={s}
                      className={`addCarSeatBtn ${form.seats === s ? 'active' : ''}`}
                      onClick={() => setForm((p) => ({ ...p, seats: String(s) }))}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="addCarSection addCarSectionAnimate">
            <div className="addCarSectionHeader">
              <span className="addCarSectionNum">03</span>
              <h2>Çmimi &amp; Statusi</h2>
            </div>

            <div className="addCarGrid">
              {form.type === 'RENTAL' && (
                <Field label="Çmimi për ditë " required error={errors.price_per_day}>
                  <div className="addCarInputPrefix">
                    <span>€</span>
                    <input
                      className="addCarInput addCarInputPrefixed"
                      type="number"
                      value={form.price_per_day}
                      onChange={set('price_per_day')}
                      placeholder="45"
                      min="15"
                    />
                  </div>
                </Field>
              )}

              {form.type === 'SALE' && (
                <Field label="Çmimi i shitjes " required error={errors.sale_price}>
                  <div className="addCarInputPrefix">
                    <span>€</span>
                    <input
                      className="addCarInput addCarInputPrefixed"
                      type="number"
                      value={form.sale_price}
                      onChange={set('sale_price')}
                      placeholder="25000"
                      min="0"
                    />
                  </div>
                </Field>
              )}

              <Field label="Statusi">
                <div className="addCarStatusGrid">
                  {[
                    { val: 'available', label: 'Lirë', color: '#10b981' },
                    { val: 'reserved', label: 'Rezervuar', color: '#f59e0b' },
                    { val: 'service', label: 'Servis', color: '#6366f1' },
                    { val: 'sold', label: 'Shitur', color: '#ef4444' },
                  ].map((s) => (
                    <div
                      key={s.val}
                      className={`addCarStatusCard ${form.status === s.val ? 'active' : ''}`}
                      style={{ '--status-color': s.color }}
                      onClick={() => setForm((p) => ({ ...p, status: s.val }))}
                    >
                      <span className="addCarStatusDot" style={{ background: s.color }} />
                      {s.label}
                    </div>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="addCarSection addCarSectionAnimate">
            <div className="addCarSectionHeader">
              <span className="addCarSectionNum">04</span>
              <h2>Fotot e Makinës</h2>
            </div>

            <label className="addCarUploadZone">
              <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
              <div className="addCarUploadZoneInner">
                <div className="addCarUploadZoneIcon">📷</div>
                <p className="addCarUploadZoneTitle">Kliko ose tërhiq fotot këtu</p>
                <p className="addCarUploadZoneHint">
                  JPG, PNG, WEBP · max 5MB secila · max 10 foto
                </p>
              </div>
            </label>

            {previews.length > 0 && (
              <div className="addCarPreviews">
                {previews.map((src, i) => (
                  <div className="addCarPreview" key={i}>
                    <img src={src} alt={`foto-${i + 1}`} />
                    {i === 0 && <span className="addCarPreviewMain">Kryesore</span>}
                    <button
                      type="button"
                      className="addCarReviewRemove"
                      onClick={() => removeImage(i)}
                    >
                      ✕
                    </button>
                    <div className="addCarPreviewOverlay">{i + 1}</div>
                  </div>
                ))}
              </div>
            )}

            {previews.length === 0 && (
              <p className="addCarUploadEmpty">
                Nuk u zgjodhën foto. Mund të shtoni foto edhe më vonë.
              </p>
            )}
          </div>
        )}

        {serverError && <div className="addCarAlert addCarAlertError">{serverError}</div>}
        {success && <div className="addCarAlert addCarAlertSuccess">✓ {success}</div>}

        <div className="addCarNavBtns">
          <button
            type="button"
            className="addCarBtn addCarBtnGhost"
            onClick={step === 0 ? () => navigate('/admin/cars') : prevStep}
          >
            {step === 0 ? 'Anulo' : '← Prapa'}
          </button>

          <div className="addCarNavBtnsRight">
            <div className="addCarDots">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`addCarDot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                />
              ))}
            </div>

            {isLastStep ? (
              <button type="submit" className="addCarBtn addCarBtnPrimary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="addCarSpinner" /> Duke shtuar...
                  </>
                ) : (
                  '✓ Shto Makinën'
                )}
              </button>
            ) : (
              <button type="button" className="addCarBtn addCarBtnPrimary" onClick={nextStep}>
                Vazhdo →
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
