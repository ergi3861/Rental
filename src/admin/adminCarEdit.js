import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ADMIN_API from '../admin/adminAPI';

const BASE = 'http://localhost:5000/uploads/';

const BRANDS = [
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

const Field = ({ label, error, children }) => (
  <div className="carEditField">
    <label>{label}</label>
    {children}
    {error && <span className="carEditError">{error}</span>}
  </div>
);

export default function AdminCarEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [media, setMedia] = useState([]);
  const [newImgs, setNewImgs] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [delImg, setDelImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverErr, setServerErr] = useState('');

  // Load car
  useEffect(() => {
    ADMIN_API.get(`/cars/${id}`)
      .then(({ data }) => {
        const { media: m, reservations: _, ...rest } = data;
        setForm(rest);
        setMedia(m || []);
      })
      .catch(() => alert('Makina nuk u gjet.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const handleNewImgs = (e) => {
    const files = Array.from(e.target.files);
    setNewImgs(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImg = (i) => {
    URL.revokeObjectURL(previews[i]);
    setNewImgs((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Fshi këtë foto?')) return;
    setDelImg(mediaId);
    try {
      await ADMIN_API.delete(`/cars/${id}/images/${mediaId}`);
      setMedia((p) => p.filter((m) => m.ID !== mediaId));
    } catch {
      alert('Gabim gjatë fshirjes së fotos.');
    } finally {
      setDelImg(null);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.brand) e.brand = 'Kërkohet';
    if (!form.model?.trim()) e.model = 'Kërkohet';
    if (!form.vin?.trim()) e.vin = 'Kërkohet';
    if (!form.year) e.year = 'Kërkohet';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setServerErr('');
    setSuccess('');

    try {
      await ADMIN_API.put(`/cars/${id}`, form);

      if (newImgs.length > 0) {
        const fd = new FormData();
        newImgs.forEach((img) => fd.append('images', img));
        await ADMIN_API.post(`/cars/${id}/images`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const { data } = await ADMIN_API.get(`/cars/${id}`);
        setMedia(data.media || []);
        previews.forEach((u) => URL.revokeObjectURL(u));
        setNewImgs([]);
        setPreviews([]);
      }

      setSuccess('✅ Makina u përditësua me sukses!');
    } catch (err) {
      setServerErr(err.response?.data?.message || 'Gabim gjatë ruajtjes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="carEditLoading">Duke ngarkuar...</div>;
  if (!form) return null;

  return (
    <div id="carEditPage">
      <div className="carEditHeader">
        <button className="carEdit" onClick={() => navigate('/admin/cars')}>
          ← Kthehu
        </button>
        <div>
          <h1 className="carEditTitle">
            Edito: {form.brand?.charAt(0).toUpperCase() + form.brand?.slice(1)} {form.model}
          </h1>
          <p className="carEditSub">ID #{id}</p>
        </div>
      </div>

      <form className="carEditForm" onSubmit={handleSave} noValidate>
        <div className="carEditSection">
          <h2>Të dhënat e automjetit</h2>
          <div className="carEditGrid">
            <div className="carEditField carEditFieldFull">
              <label>Lloji</label>
              <div className="carEditTypeToggle">
                {['RENTAL', 'SALE'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`carEditTypeBtn ${form.type === t ? 'active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                  >
                    {t === 'RENTAL' ? '🚗 Qira' : '🤝 Shitje'}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Marka *" error={errors.brand}>
              <select value={form.brand || ''} onChange={set('brand')}>
                <option value="">-- Zgjidh --</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Modeli *" error={errors.model}>
              <input value={form.model || ''} onChange={set('model')} />
            </Field>

            <Field label="VIN *" error={errors.vin}>
              <input value={form.vin || ''} onChange={set('vin')} maxLength={17} />
            </Field>

            <Field label="Viti *" error={errors.year}>
              <input
                type="number"
                value={form.year || ''}
                onChange={set('year')}
                min="1950"
                max={new Date().getFullYear()}
              />
            </Field>

            <Field label="Kategoria">
              <select value={form.category || 'SUV'} onChange={set('category')}>
                {['Ekonomike', 'Kompakt', 'SUV', 'Luksoze', 'Elektrike', 'Hibride'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Karburanti">
              <select value={form.fuel || 'nafte'} onChange={set('fuel')}>
                <option value="nafte">Naftë</option>
                <option value="benzin">Benzinë</option>
                <option value="elektrike">Elektrike</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>

            <Field label="Transmisioni">
              <select value={form.transmission || 'manual'} onChange={set('transmission')}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatik</option>
                <option value="semi-automatic">Semi-automatik</option>
                <option value="tiptronic">Tiptronic</option>
              </select>
            </Field>

            <Field label="Ngjyra">
              <select value={form.color || 'black'} onChange={set('color')}>
                {[
                  'black',
                  'white',
                  'grey',
                  'silver',
                  'red',
                  'blue',
                  'green',
                  'yellow',
                  'orange',
                  'brown',
                  'beige',
                  'gold',
                  'purple',
                  'pink',
                  'navy',
                  'pearl',
                  'cream',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ulëset">
              <select value={form.seats || '5'} onChange={set('seats')}>
                {[2, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Statusi">
              <select value={form.status || 'available'} onChange={set('status')}>
                <option value="available">Lirë</option>
                <option value="reserved">Rezervuar</option>
                <option value="pending">Në pritje</option>
                <option value="sold">Shitur</option>
                <option value="service">Servis</option>
              </select>
            </Field>

            {form.type === 'RENTAL' && (
              <Field label="Çmimi / ditë (€)">
                <input
                  type="number"
                  value={form.price_per_day || ''}
                  onChange={set('price_per_day')}
                  min="0"
                />
              </Field>
            )}

            {form.type === 'SALE' && (
              <Field label="Çmimi shitje (€)">
                <input
                  type="number"
                  value={form.sale_price || ''}
                  onChange={set('sale_price')}
                  min="0"
                />
              </Field>
            )}
          </div>
        </div>

        <div className="carEditSection">
          <h2>Fotot ekzistuese ({media.length})</h2>
          {media.length === 0 ? (
            <p className="carEditEmptyImgs">Nuk ka foto.</p>
          ) : (
            <div className="carEditMediaGrid">
              {media.map((m, i) => (
                <div className="carEditMediaItem" key={m.ID}>
                  <img src={`${BASE}${m.image_path}`} alt={`foto-${i}`} />
                  {i === 0 && <span className="carEditMainBadge">Kryesore</span>}
                  <button
                    type="button"
                    className="carEditDelImg"
                    disabled={delImg === m.ID}
                    onClick={() => handleDeleteMedia(m.ID)}
                  >
                    {delImg === m.ID ? '...' : '✕'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Shto foto të reja ── */}
        <div className="carEditSection">
          <h2>Shto foto të reja</h2>
          <label className="carEditUploadLabel">
            <input type="file" accept="image/*" multiple onChange={handleNewImgs} hidden />
            <div className="carEditUploadBox">
              <span>📷</span>
              <span>Kliko për të ngarkuar</span>
              <span className="carEditUploadHint">JPG, PNG, WEBP · max 5MB</span>
            </div>
          </label>

          {previews.length > 0 && (
            <div className="carEditMediaGrid" style={{ marginTop: '12px' }}>
              {previews.map((src, i) => (
                <div className="carEditMediaItem" key={i}>
                  <img src={src} alt={`new-${i}`} />
                  <button type="button" className="carEditDelImg" onClick={() => removeNewImg(i)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {serverErr && <p className="carEditServerError">{serverErr}</p>}
        {success && <p className="carEditSuccess">{success}</p>}

        <div className="carEdit-footer">
          <button
            type="button"
            className="carEditBtnCancel"
            onClick={() => navigate('/admin/cars')}
          >
            Anulo
          </button>
          <button type="submit" className="carEditBtnSave" disabled={saving}>
            {saving ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
          </button>
        </div>
      </form>
    </div>
  );
}
