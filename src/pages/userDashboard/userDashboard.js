import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../backendConnection/context';
import API from '../../backendConnection/api';
import Navigimi from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import '../userDashboard/userDashboard.css';

const BASE = 'https://rentalbackend.railway.internal/uploads/';

// ── helpers ───────────────────────────────────────────────────
const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const STATUS_COLOR = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
  available: '#10b981',
  reserved: '#f59e0b',
  sold: '#ef4444',
  offered: '#a78bfa',
  reviewed: '#38bdf8',
  accepted: '#10b981',
  rejected: '#ef4444',
};

// ── Profile completion banner ─────────────────────────────────
function CompletionBanner({ pct, onGoToProfile }) {
  if (pct >= 100) return null;
  return (
    <div className="ud-banner">
      <div className="ud-banner__left">
        <span className="ud-banner__icon">⚠️</span>
        <div>
          <p className="ud-banner__title">Profili juaj është i paplotë</p>
          <p className="ud-banner__sub">
            Plotësoni profilin për të rezervuar makina dhe për t'u identifikuar.
          </p>
        </div>
      </div>
      <div className="ud-banner__right">
        <div className="ud-banner__bar">
          <div className="ud-banner__fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="ud-banner__pct">{pct}%</span>
        <button className="ud-banner__btn" onClick={onGoToProfile}>
          Plotëso →
        </button>
      </div>
    </div>
  );
}

// ── Tab nav ───────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Përmbledhje', icon: '🏠' },
  { id: 'profile', label: 'Profili', icon: '👤' },
  { id: 'reservations', label: 'Rezervimet', icon: '📋' },
  { id: 'sell', label: 'Kërkesat shitje', icon: '🤝' },
  { id: 'documents', label: 'Dokumentat', icon: '📄' },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [sellReqs, setSellReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState({});
  const licenseRef = useRef(null);
  const photoRef = useRef(null);

  // ── Load data ─────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      API.get('/user/profile'),
      API.get('/user/reservations'),
      API.get('/sell-requests/my'),
    ])
      .then(([p, r, s]) => {
        setProfile(p.data);
        setForm({
          phone: p.data.phone || '',
          date_of_birth: p.data.date_of_birth || '',
          age: p.data.age || '',
          gender: p.data.gender || '',
          address: p.data.address || '',
          city: p.data.city || '',
          country: p.data.country || 'Albania',
          id_number: p.data.id_number || '',
          license_number: p.data.license_number || '',
          license_expiry: p.data.license_expiry || '',
        });
        setReservations(r.data || []);
        setSellReqs(s.data?.rows || s.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();
  const pct = profile?.completion_percent || 0;

  // ── Save profile ──────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    // Validim moshe — min 20 vjeç
    if (form.date_of_birth) {
      const age = Math.floor((Date.now() - new Date(form.date_of_birth)) / 31557600000);
      if (age < 20) {
        setSaveMsg('✕ Duhet të jeni të paktën 20 vjeç për të përdorur platformën.');
        setSaving(false);
        return;
      }
    }

    try {
      const { data } = await API.put('/user/profile', form);
      setProfile((prev) => ({ ...prev, ...data.user }));
      setSaveMsg('✓ Profili u ruajt me sukses!');
    } catch (err) {
      setSaveMsg('✕ ' + (err.response?.data?.message || 'Gabim.'));
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  // ── Upload license ────────────────────────────────────────
  const handleLicense = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('license_photo', file);
    try {
      const { data } = await API.post('/user/profile/license', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, license_photo: data.license_photo }));
      setSaveMsg('✓ Patenta u ngarkua!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('✕ Gabim gjatë ngarkimit.');
    }
  };

  // ── Upload photo ──────────────────────────────────────────
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('profile_photo', file);
    try {
      const { data } = await API.post('/user/profile/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, profile_photo: data.profile_photo }));
    } catch {
      alert('Gabim gjatë ngarkimit.');
    }
  };

  if (loading)
    return (
      <>
        <Navigimi />
        <div className="ud-loading">
          <div className="ud-spinner" />
          <p>Duke ngarkuar...</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navigimi />
      <div className="ud-page">
        {/* ── Hero header ── */}
        <div className="ud-hero">
          <div className="ud-hero__inner">
            <div className="ud-hero__avatar-wrap">
              {profile?.profile_photo ? (
                <img
                  className="ud-hero__avatar"
                  src={`${BASE}${profile.profile_photo}`}
                  alt="foto"
                />
              ) : (
                <div className="ud-hero__avatar ud-hero__avatar--placeholder">{initials}</div>
              )}
              <button
                className="ud-hero__avatar-edit"
                onClick={() => photoRef.current?.click()}
                title="Ndrysho foton"
              >
                📷
              </button>
              <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
            </div>
            <div className="ud-hero__info">
              <h1 className="ud-hero__name">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="ud-hero__email">{user?.email}</p>
              <div className="ud-hero__tags">
                <span className="ud-tag ud-tag--role">{user?.role}</span>
                {profile?.profile_complete ? (
                  <span className="ud-tag ud-tag--ok">✓ Profil i plotë</span>
                ) : (
                  <span className="ud-tag ud-tag--warn">⚠ Profil i paplotë</span>
                )}
              </div>
            </div>
            <div className="ud-hero__stats">
              <div className="ud-hero__stat">
                <span className="ud-hero__stat-val">{reservations.length}</span>
                <span className="ud-hero__stat-lbl">Rezervime</span>
              </div>
              <div className="ud-hero__stat">
                <span className="ud-hero__stat-val">{sellReqs.length}</span>
                <span className="ud-hero__stat-lbl">Kërkesa</span>
              </div>
              <div className="ud-hero__stat">
                <span className="ud-hero__stat-val">{pct}%</span>
                <span className="ud-hero__stat-lbl">Profil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ud-body">
          {/* Banner */}
          <CompletionBanner pct={pct} onGoToProfile={() => setTab('profile')} />

          {/* Tabs */}
          <div className="ud-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`ud-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="ud-section ud-overview">
              <div className="ud-overview__grid">
                {/* Quick info */}
                <div className="ud-card">
                  <h3 className="ud-card__title">Informacione të shpejta</h3>
                  <div className="ud-info-list">
                    {[
                      { icon: '📞', label: 'Telefon', val: profile?.phone || '—' },
                      { icon: '🏙️', label: 'Qyteti', val: profile?.city || '—' },
                      { icon: '🌍', label: 'Shteti', val: profile?.country || '—' },
                      {
                        icon: '🎂',
                        label: 'Mosha',
                        val: profile?.age ? `${profile.age} vjeç` : '—',
                      },
                      { icon: '🪪', label: 'ID', val: profile?.id_number || '—' },
                      { icon: '🚗', label: 'Patenta', val: profile?.license_number || '—' },
                    ].map((item, i) => (
                      <div key={i} className="ud-info-row">
                        <span className="ud-info-row__icon">{item.icon}</span>
                        <span className="ud-info-row__label">{item.label}</span>
                        <span className="ud-info-row__val">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  {pct < 100 && (
                    <button
                      className="ud-btn ud-btn--outline"
                      style={{ marginTop: 16, width: '100%' }}
                      onClick={() => setTab('profile')}
                    >
                      Plotëso profilin →
                    </button>
                  )}
                </div>

                {/* Rezervimi i fundit */}
                <div className="ud-card">
                  <h3 className="ud-card__title">Rezervimi i fundit</h3>
                  {reservations.length === 0 ? (
                    <div className="ud-empty">
                      <p>Nuk ke rezervime ende.</p>
                      <Link to="/cars" className="ud-btn ud-btn--primary">
                        Shiko makinat →
                      </Link>
                    </div>
                  ) : (
                    <>
                      {reservations.slice(0, 2).map((r) => (
                        <div key={r.id} className="ud-res-card">
                          <div className="ud-res-card__img">
                            {r.thumbnail ? (
                              <img src={`${BASE}${r.thumbnail}`} alt={r.model} />
                            ) : (
                              <span>🚗</span>
                            )}
                          </div>
                          <div className="ud-res-card__info">
                            <p className="ud-res-card__name">
                              {r.brand} {r.model} ({r.year})
                            </p>
                            <p className="ud-res-card__dates">
                              {fmt(r.start_datetime)} → {fmt(r.end_datetime)}
                            </p>
                            <div className="ud-res-card__footer">
                              <span
                                className="ud-badge"
                                style={{
                                  background: (STATUS_COLOR[r.status] || '#94a3b8') + '22',
                                  color: STATUS_COLOR[r.status] || '#94a3b8',
                                }}
                              >
                                {r.status}
                              </span>
                              <span className="ud-res-card__price">
                                €{Number(r.total_price || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="ud-btn ud-btn--ghost"
                        style={{ marginTop: 12, width: '100%' }}
                        onClick={() => setTab('reservations')}
                      >
                        Të gjitha rezervimet →
                      </button>
                    </>
                  )}
                </div>

                {/* Completion */}
                <div className="ud-card ud-card--accent">
                  <h3 className="ud-card__title">Plotësimi i profilit</h3>
                  <div className="ud-completion">
                    <div className="ud-completion__circle">
                      <svg viewBox="0 0 36 36">
                        <path
                          className="ud-completion__bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="ud-completion__fill"
                          strokeDasharray={`${pct}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="ud-completion__num">{pct}%</span>
                    </div>
                    <div className="ud-completion__items">
                      {[
                        { label: 'Telefon', done: !!profile?.phone },
                        { label: 'Datëlindja', done: !!profile?.date_of_birth },
                        { label: 'Adresa', done: !!profile?.address },
                        { label: 'Qyteti', done: !!profile?.city },
                        { label: 'Numri ID', done: !!profile?.id_number },
                        { label: 'Nr. patentës', done: !!profile?.license_number },
                        { label: 'Foto patentës', done: !!profile?.license_photo },
                      ].map((item, i) => (
                        <div key={i} className={`ud-completion__item ${item.done ? 'done' : ''}`}>
                          <span>{item.done ? '✓' : '○'}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="ud-section">
              <form className="ud-profile-form" onSubmit={handleSave}>
                <div className="ud-form-grid">
                  <div className="ud-form-group">
                    <label>Emri</label>
                    <input
                      value={user?.first_name || ''}
                      disabled
                      className="ud-input ud-input--disabled"
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Mbiemri</label>
                    <input
                      value={user?.last_name || ''}
                      disabled
                      className="ud-input ud-input--disabled"
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Email</label>
                    <input
                      value={user?.email || ''}
                      disabled
                      className="ud-input ud-input--disabled"
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Telefon *</label>
                    <input
                      className="ud-input"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+355..."
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Datëlindja *</label>
                    <input
                      type="date"
                      className="ud-input"
                      value={form.date_of_birth}
                      onChange={(e) => {
                        const age = e.target.value
                          ? Math.floor((Date.now() - new Date(e.target.value)) / 31557600000)
                          : '';
                        setForm((p) => ({ ...p, date_of_birth: e.target.value, age }));
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Mosha</label>
                    <input
                      className="ud-input ud-input--disabled"
                      value={form.age ? `${form.age} vjeç` : ''}
                      disabled
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Gjinia</label>
                    <select
                      className="ud-input"
                      value={form.gender}
                      onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                    >
                      <option value="">-- Zgjidh --</option>
                      <option value="male">Mashkull</option>
                      <option value="female">Femër</option>
                      <option value="other">Tjetër</option>
                    </select>
                  </div>
                  <div className="ud-form-group">
                    <label>Shteti</label>
                    <input
                      className="ud-input"
                      value={form.country}
                      onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Qyteti *</label>
                    <input
                      className="ud-input"
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Tiranë"
                    />
                  </div>
                  <div className="ud-form-group ud-form-group--full">
                    <label>Adresa *</label>
                    <input
                      className="ud-input"
                      value={form.address}
                      onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Rruga, numri..."
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Numri i ID / Pasaportës *</label>
                    <input
                      className="ud-input"
                      value={form.id_number}
                      onChange={(e) => setForm((p) => ({ ...p, id_number: e.target.value }))}
                      placeholder="AB123456"
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Numri i patentës *</label>
                    <input
                      className="ud-input"
                      value={form.license_number}
                      onChange={(e) => setForm((p) => ({ ...p, license_number: e.target.value }))}
                      placeholder="DL-123456"
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Data e skadimit të patentës</label>
                    <input
                      type="date"
                      className="ud-input"
                      value={form.license_expiry}
                      onChange={(e) => setForm((p) => ({ ...p, license_expiry: e.target.value }))}
                    />
                  </div>
                </div>

                {saveMsg && (
                  <p
                    className={`ud-save-msg ${saveMsg.startsWith('✓') ? 'ud-save-msg--ok' : 'ud-save-msg--err'}`}
                  >
                    {saveMsg}
                  </p>
                )}

                <button type="submit" className="ud-btn ud-btn--primary" disabled={saving}>
                  {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
                </button>
              </form>
            </div>
          )}

          {/* ── RESERVATIONS ── */}
          {tab === 'reservations' && (
            <div className="ud-section">
              <h2 className="ud-section-title">Rezervimet e mia</h2>
              {reservations.length === 0 ? (
                <div className="ud-empty">
                  <p>Nuk ke rezervime ende.</p>
                  <Link to="/cars" className="ud-btn ud-btn--primary">
                    Rezervo tani →
                  </Link>
                </div>
              ) : (
                <div className="ud-res-list">
                  {reservations.map((r) => (
                    <div key={r.id} className="ud-res-item">
                      <div className="ud-res-item__img">
                        {r.thumbnail ? (
                          <img src={`${BASE}${r.thumbnail}`} alt={r.model} />
                        ) : (
                          <span>🚗</span>
                        )}
                      </div>
                      <div className="ud-res-item__body">
                        <div className="ud-res-item__top">
                          <h4>
                            {r.brand} {r.model} <span>({r.year})</span>
                          </h4>
                          <span
                            className="ud-badge"
                            style={{
                              background: (STATUS_COLOR[r.status] || '#94a3b8') + '22',
                              color: STATUS_COLOR[r.status] || '#94a3b8',
                            }}
                          >
                            {r.status}
                          </span>
                        </div>
                        <div className="ud-res-item__details">
                          <span>
                            📅 {fmt(r.start_datetime)} → {fmt(r.end_datetime)}
                          </span>
                          <span>
                            📍 {r.pickup_location || '—'} → {r.dropoff_location || '—'}
                          </span>
                          <span>💶 €{Number(r.total_price || 0).toLocaleString()}</span>
                          <span>🔑 #{r.id}</span>
                        </div>
                      </div>
                      <Link to={`/cars/${r.car_id}`} className="ud-btn ud-btn--ghost ud-btn--sm">
                        Shiko →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SELL REQUESTS ── */}
          {tab === 'sell' && (
            <div className="ud-section">
              <div className="ud-section-header">
                <h2 className="ud-section-title">Kërkesat për shitje</h2>
                <Link to="/buy" className="ud-btn ud-btn--primary">
                  + Kërkesë e re
                </Link>
              </div>
              {sellReqs.length === 0 ? (
                <div className="ud-empty">
                  <p>Nuk ke kërkesa shitje ende.</p>
                  <Link to="/buy" className="ud-btn ud-btn--primary">
                    Shit makinën tënde →
                  </Link>
                </div>
              ) : (
                <div className="ud-sell-list">
                  {sellReqs.map((s) => (
                    <div key={s.id} className="ud-sell-item">
                      <div className="ud-sell-item__info">
                        <h4>
                          {s.brand} {s.model} ({s.year})
                        </h4>
                        <p>
                          {Number(s.mileage).toLocaleString()} km · {s.fuel} · {s.city}
                        </p>
                        <p className="ud-sell-item__date">Dërguar: {fmt(s.created_at)}</p>
                      </div>
                      <div className="ud-sell-item__prices">
                        {s.asking_price && (
                          <div className="ud-sell-item__price">
                            <span>Çmimi juaj</span>
                            <strong>€{Number(s.asking_price).toLocaleString()}</strong>
                          </div>
                        )}
                        {s.admin_offer_price && (
                          <div className="ud-sell-item__price ud-sell-item__price--offer">
                            <span>Oferta jonë</span>
                            <strong>€{Number(s.admin_offer_price).toLocaleString()}</strong>
                          </div>
                        )}
                      </div>
                      <span
                        className="ud-badge"
                        style={{
                          background: (STATUS_COLOR[s.status] || '#94a3b8') + '22',
                          color: STATUS_COLOR[s.status] || '#94a3b8',
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {tab === 'documents' && (
            <div className="ud-section">
              <h2 className="ud-section-title">Dokumentat e mia</h2>
              <div className="ud-docs-grid">
                {/* Foto patentës */}
                <div className="ud-doc-card">
                  <div className="ud-doc-card__header">
                    <span className="ud-doc-card__icon">🚗</span>
                    <div>
                      <h4>Patenta e drejtimit</h4>
                      <p>Nr: {profile?.license_number || '—'}</p>
                      {profile?.license_expiry && <p>Skadon: {fmt(profile.license_expiry)}</p>}
                    </div>
                    <span className={`ud-doc-status ${profile?.license_photo ? 'ok' : 'missing'}`}>
                      {profile?.license_photo ? '✓ Ngarkuar' : '⚠ Mungon'}
                    </span>
                  </div>
                  {profile?.license_photo && (
                    <img
                      className="ud-doc-card__img"
                      src={`${BASE}${profile.license_photo}`}
                      alt="patenta"
                    />
                  )}
                  <button
                    className="ud-btn ud-btn--outline"
                    onClick={() => licenseRef.current?.click()}
                  >
                    {profile?.license_photo ? '📷 Ndrysho foton' : '📷 Ngarko foton'}
                  </button>
                  <input
                    ref={licenseRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLicense}
                  />
                  {saveMsg && (
                    <p className="ud-save-msg ud-save-msg--ok" style={{ marginTop: 8 }}>
                      {saveMsg}
                    </p>
                  )}
                </div>

                {/* ID / Pasaportë */}
                <div className="ud-doc-card">
                  <div className="ud-doc-card__header">
                    <span className="ud-doc-card__icon">🪪</span>
                    <div>
                      <h4>ID / Pasaportë</h4>
                      <p>Nr: {profile?.id_number || '—'}</p>
                    </div>
                    <span className={`ud-doc-status ${profile?.id_number ? 'ok' : 'missing'}`}>
                      {profile?.id_number ? '✓ Plotësuar' : '⚠ Mungon'}
                    </span>
                  </div>
                  <button className="ud-btn ud-btn--outline" onClick={() => setTab('profile')}>
                    Shto numrin →
                  </button>
                </div>

                {/* Info tip */}
                <div className="ud-doc-info">
                  <span>ℹ️</span>
                  <p>
                    Dokumentat juaja ruhen në mënyrë të sigurt dhe përdoren vetëm për verifikimin e
                    identitetit gjatë procesit të rezervimit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
