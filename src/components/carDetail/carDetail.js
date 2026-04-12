import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../backendConnection/api';
import Navigimi from '../navbar/navbar';
import Footer from '../footer/footer';
import '../carDetail/carDetail.css';

const BASE = 'http://rentalbackend.railway.internal/uploads/';

// Helper për URL të plotë të fotos
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE}${path}`;
};

const FUEL_LABELS = {
  nafte: 'Naftë (Diesel)',
  benzin: 'Benzinë',
  elektrike: 'Elektrike',
  hybrid: 'Hybrid',
};

const TRANS_LABELS = {
  manual: 'Manual',
  automatic: 'Automatik',
  'semi-automatic': 'Semi-automatik',
  tiptronic: 'Tiptronic',
};

const STATUS_META = {
  available: { label: 'E disponueshme', color: '#10b981', bg: '#052e16' },
  reserved: { label: 'E rezervuar', color: '#f59e0b', bg: '#2d1a00' },
  sold: { label: 'E shitur', color: '#ef4444', bg: '#2d0a0a' },
  service: { label: 'Në servis', color: '#6366f1', bg: '#1a1040' },
};

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [similar, setSimilar] = useState([]);

  // Rental form
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);
  const [bookErr, setBookErr] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookOk, setBookOk] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    API.get(`/cars/${id}`)
      .then(({ data }) => {
        const car = data?.data || data;
        setCar(car);
        setMedia(car.media || []);
        return API.get(`/cars?category=${car.category}&limit=4`);
      })
      .then(({ data }) => {
        const rows = data?.data || data?.rows || (Array.isArray(data) ? data : []);
        setSimilar(rows.filter((c) => String(c.id) !== String(id)).slice(0, 3));
      })
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!dateFrom || !dateTo || !car) return;
    const d1 = new Date(dateFrom);
    const d2 = new Date(dateTo);
    if (d2 <= d1) {
      setDays(0);
      setTotal(0);
      return;
    }
    const d = Math.ceil((d2 - d1) / 86400000);
    setDays(d);
    setTotal(d * parseFloat(car.price_per_day || 0));
  }, [dateFrom, dateTo, car]);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookErr('');
    if (!pickup) return setBookErr('Zgjidh vendin e marrjes.');
    if (!dropoff) return setBookErr('Zgjidh vendin e kthimit.');
    if (!dateFrom) return setBookErr('Zgjidh datën e fillimit.');
    if (!dateTo) return setBookErr('Zgjidh datën e mbarimit.');
    if (days < 1) return setBookErr('Data e mbarimit duhet të jetë pas fillimit.');

    setBooking(true);
    try {
      await API.post('/reservations', {
        car_id: car.id,
        pickup_location: pickup,
        dropoff_location: dropoff,
        start_datetime: dateFrom,
        end_datetime: dateTo,
        price_per_day: car.price_per_day,
      });
      setBookOk(true);
    } catch (err) {
      setBookErr(
        err.response?.data?.message || err.response?.data?.error || 'Gabim gjatë rezervimit.'
      );
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading)
    return (
      <>
        <Navigimi />
        <div className="cd-loading">
          <div className="cd-spinner" />
          <p>Duke ngarkuar makinën...</p>
        </div>
        <Footer />
      </>
    );

  if (!car)
    return (
      <>
        <Navigimi />
        <div className="cd-loading">
          <p style={{ color: '#ef4444' }}>Makina nuk u gjet.</p>
          <button className="cd-btn-back" onClick={() => navigate('/cars')}>
            ← Kthehu
          </button>
        </div>
        <Footer />
      </>
    );

  const sm = STATUS_META[car.status] || STATUS_META.available;
  const isRent = car.type === 'RENTAL';
  const isSale = car.type === 'SALE';
  const canBook = car.status === 'available';

  return (
    <>
      <Navigimi />
      <div className="cd-page">
        <div className="cd-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/cars">Makinat</Link>
          <span>›</span>
          <span>
            {(car?.brand || '').charAt(0).toUpperCase() + (car?.brand || '').slice(1)} {car.model}
          </span>
        </div>

        <div className="cd-layout">
          <div className="cd-left">
            <div className="cd-gallery">
              <div className="cd-gallery__main">
                {media.length > 0 ? (
                  <img src={imgUrl(media[activeImg]?.image_path)} alt={car.model} />
                ) : (
                  <div className="cd-gallery__placeholder">🚗</div>
                )}
                <div
                  className="cd-status-badge"
                  style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.color}44` }}
                >
                  <span className="cd-status-dot" style={{ background: sm.color }} />
                  {sm.label}
                </div>
                <div
                  className={`cd-type-badge ${isRent ? 'cd-type-badge--rental' : 'cd-type-badge--sale'}`}
                >
                  {isRent ? '🚗 Qira' : '🤝 Shitje'}
                </div>
                {media.length > 1 && (
                  <>
                    <button
                      className="cd-gallery__arrow cd-gallery__arrow--prev"
                      onClick={() => setActiveImg((i) => (i - 1 + media.length) % media.length)}
                    >
                      ‹
                    </button>
                    <button
                      className="cd-gallery__arrow cd-gallery__arrow--next"
                      onClick={() => setActiveImg((i) => (i + 1) % media.length)}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {media.length > 1 && (
                <div className="cd-gallery__thumbs">
                  {media.map((m, i) => (
                    <div
                      key={m.ID}
                      className={`cd-gallery__thumb ${activeImg === i ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={imgUrl(m.image_path)} alt={`foto-${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Title + Price ── */}
            <div className="cd-hero">
              <div className="cd-hero__left">
                <h1 className="cd-hero__name">
                  {(car?.brand || '').charAt(0).toUpperCase() + (car?.brand || '').slice(1)}{' '}
                  {car.model}
                </h1>
                <p className="cd-hero__year">
                  {car.year} · {car.category}
                </p>
              </div>
              <div className="cd-hero__right">
                {isRent && (
                  <div className="cd-price">
                    <span className="cd-price__amount">
                      €{Number(car.price_per_day).toLocaleString()}
                    </span>
                    <span className="cd-price__unit">/ ditë</span>
                  </div>
                )}
                {isSale && (
                  <div className="cd-price cd-price--sale">
                    <span className="cd-price__amount">
                      €{Number(car.sale_price).toLocaleString()}
                    </span>
                    <span className="cd-price__unit">çmimi total</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Specs grid ── */}
            <div className="cd-section">
              <h2 className="cd-section__title">Specifikimet</h2>
              <div className="cd-specs">
                {[
                  {
                    key: 'Marka',
                    val: (car?.brand || '').charAt(0).toUpperCase() + (car?.brand || '').slice(1),
                    icon: '🏷️',
                  },
                  { key: 'Modeli', val: car.model, icon: '🚘' },
                  { key: 'Viti', val: car.year, icon: '📅' },
                  { key: 'Karburanti', val: FUEL_LABELS[car.fuel] || car.fuel, icon: '⛽' },
                  {
                    key: 'Transmisioni',
                    val: TRANS_LABELS[car.transmission] || car.transmission,
                    icon: '⚙️',
                  },
                  { key: 'Ngjyra', val: car.color, icon: '🎨' },
                  { key: 'Ulëset', val: car.seats, icon: '💺' },
                  { key: 'Kategoria', val: car.category, icon: '📂' },
                ].map((s, i) => (
                  <div key={i} className="cd-spec-item">
                    <span className="cd-spec-item__icon">{s.icon}</span>
                    <div>
                      <p className="cd-spec-item__key">{s.key}</p>
                      <p className="cd-spec-item__val">{s.val || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Gjendja / Përshkrimi ── */}
            {car.condition && (
              <div className="cd-section">
                <h2 className="cd-section__title">Gjendja</h2>
                <p className="cd-condition">{car.condition}</p>
              </div>
            )}

            {/* ── Similar cars ── */}
            {similar.length > 0 && (
              <div className="cd-section">
                <h2 className="cd-section__title">Mund të të interesojë</h2>
                <div className="cd-similar">
                  {similar.map((s) => (
                    <div
                      key={s.id}
                      className="cd-similar-card"
                      onClick={() => navigate(`/cars/${s.id}`)}
                    >
                      <div className="cd-similar-card__img">
                        {s.thumbnail ? (
                          <img src={imgUrl(s.thumbnail)} alt={s.model} />
                        ) : s.media?.[0]?.image_path ? (
                          <img src={imgUrl(s.media[0].image_path)} alt={s.model} />
                        ) : (
                          <span>🚗</span>
                        )}
                      </div>
                      <div className="cd-similar-card__info">
                        <p className="cd-similar-card__name">
                          {(s?.brand || '').charAt(0).toUpperCase() + (s?.brand || '').slice(1)}{' '}
                          {s.model}
                        </p>
                        <p className="cd-similar-card__meta">
                          {s.year} · {s.category}
                        </p>
                        <p className="cd-similar-card__price">
                          {s.type === 'RENTAL'
                            ? `€${Number(s.price_per_day).toLocaleString()}/ditë`
                            : `€${Number(s.sale_price).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════
              RIGHT — Booking / Sale Panel
              ════════════════════════════════════ */}
          <div className="cd-right">
            <div className="cd-panel">
              {/* ── RENTAL FORM ── */}
              {isRent && (
                <>
                  <div className="cd-panel__header">
                    <h3>Rezervo tani</h3>
                    <span className="cd-panel__price">
                      €{Number(car.price_per_day).toLocaleString()}
                      <small>/ditë</small>
                    </span>
                  </div>

                  {!canBook && (
                    <div className="cd-panel__unavailable">
                      <span>⚠️</span> Kjo makinë nuk është e disponueshme për rezervim momentalisht.
                    </div>
                  )}

                  {bookOk ? (
                    <div className="cd-panel__success">
                      <div className="cd-panel__success-icon">✓</div>
                      <h4>Rezervimi u krye!</h4>
                      <p>Do t'ju kontaktojmë për konfirmim brenda 24 orësh.</p>
                      <button
                        className="cd-btn-primary"
                        onClick={() => {
                          setBookOk(false);
                          setDateFrom('');
                          setDateTo('');
                          setPickup('');
                          setDropoff('');
                        }}
                      >
                        Rezervo sërish
                      </button>
                    </div>
                  ) : (
                    <form className="cd-form" onSubmit={handleBook} noValidate>
                      <div className="cd-form__field">
                        <label>Vendi i marrjes</label>
                        <select
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          disabled={!canBook}
                        >
                          <option value="">-- Zgjidh --</option>
                          <option value="Tirana Center">Tirana Center</option>
                          <option value="Tirana Airport">Aeroporti Tiranë</option>
                          <option value="Durrës">Durrës</option>
                          <option value="Vlorë">Vlorë</option>
                          <option value="Shkodër">Shkodër</option>
                        </select>
                      </div>

                      <div className="cd-form__field">
                        <label>Vendi i kthimit</label>
                        <select
                          value={dropoff}
                          onChange={(e) => setDropoff(e.target.value)}
                          disabled={!canBook}
                        >
                          <option value="">-- Zgjidh --</option>
                          <option value="Tirana Center">Tirana Center</option>
                          <option value="Tirana Airport">Aeroporti Tiranë</option>
                          <option value="Durrës">Durrës</option>
                          <option value="Vlorë">Vlorë</option>
                          <option value="Shkodër">Shkodër</option>
                        </select>
                      </div>

                      <div className="cd-form__row">
                        <div className="cd-form__field">
                          <label>Data e fillimit</label>
                          <input
                            type="date"
                            min={today}
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            disabled={!canBook}
                          />
                        </div>
                        <div className="cd-form__field">
                          <label>Data e mbarimit</label>
                          <input
                            type="date"
                            min={dateFrom || today}
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            disabled={!canBook}
                          />
                        </div>
                      </div>

                      {/* Price breakdown */}
                      {days > 0 && (
                        <div className="cd-price-breakdown">
                          <div className="cd-price-breakdown__row">
                            <span>
                              €{Number(car.price_per_day).toLocaleString()} × {days} ditë
                            </span>
                            <span>€{total.toLocaleString()}</span>
                          </div>
                          <div className="cd-price-breakdown__total">
                            <span>Total</span>
                            <span>€{total.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {bookErr && <p className="cd-form__error">{bookErr}</p>}

                      <button
                        type="submit"
                        className="cd-btn-primary"
                        disabled={booking || !canBook}
                      >
                        {booking ? (
                          <>
                            <span className="cd-btn-spinner" /> Duke rezervuar...
                          </>
                        ) : (
                          'Rezervo tani'
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ── SALE PANEL ── */}
              {isSale && (
                <>
                  <div className="cd-panel__header">
                    <h3>Bli këtë makinë</h3>
                    <span className="cd-panel__price cd-panel__price--sale">
                      €{Number(car.sale_price).toLocaleString()}
                    </span>
                  </div>

                  {!canBook && (
                    <div className="cd-panel__unavailable">
                      <span>⚠️</span> Kjo makinë nuk është e disponueshme momentalisht.
                    </div>
                  )}

                  <div className="cd-sale-ctas">
                    <a href="tel:+355691234567" className="cd-btn-primary">
                      📞 Na kontakto
                    </a>
                    <a
                      href="https://wa.me/355691234567"
                      target="_blank"
                      rel="noreferrer"
                      className="cd-btn-whatsapp"
                    >
                      💬 WhatsApp
                    </a>
                    <Link to="/buy" className="cd-btn-outline">
                      Shit makinën tënde →
                    </Link>
                  </div>

                  <div className="cd-sale-info">
                    <div className="cd-sale-info__row">
                      <span>✓</span>
                      <span>Çmim i negociueshëm</span>
                    </div>
                    <div className="cd-sale-info__row">
                      <span>✓</span>
                      <span>Dokumenta të plota</span>
                    </div>
                    <div className="cd-sale-info__row">
                      <span>✓</span>
                      <span>Test drive i disponueshëm</span>
                    </div>
                    <div className="cd-sale-info__row">
                      <span>✓</span>
                      <span>Pa ndërmjetës</span>
                    </div>
                  </div>
                </>
              )}

              {/* ── Share ── */}
              <div className="cd-panel__share">
                <span>Ndaj:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Linku u kopjua!');
                  }}
                  title="Kopjo linkun"
                >
                  🔗
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
