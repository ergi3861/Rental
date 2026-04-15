import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../backendConnection/api';
import Navigimi from '../navbar/navbar';
import Footer from '../footer/footer';
import '../carDetail/carDetail.css';

const BASE = 'https://rentalbackend.railway.internal/';

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

            <div className="cd-hero">
              <div className="cd-hero__left">
                <h1 className="cd-hero__name">
                  {(car?.brand || '').charAt(0).toUpperCase() + (car?.brand || '').slice(1)} {car.model}
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

            <div className="cd-section">
              <h2 className="cd-section__title">Specifikimet</h2>
              <div className="cd-specs">
                {[
                  { key: 'Marka', val: car.brand, icon: '🏷️' },
                  { key: 'Modeli', val: car.model, icon: '🚘' },
                  { key: 'Viti', val: car.year, icon: '📅' },
                  { key: 'Karburanti', val: FUEL_LABELS[car.fuel] || car.fuel, icon: '⛽' },
                  { key: 'Transmisioni', val: TRANS_LABELS[car.transmission] || car.transmission, icon: '⚙️' },
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

            {similar.length > 0 && (
              <div className="cd-section">
                <h2 className="cd-section__title">Mund të të interesojë</h2>
                <div className="cd-similar">
                  {similar.map((s) => (
                    <div key={s.id} className="cd-similar-card" onClick={() => navigate(`/cars/${s.id}`)}>
                      <div className="cd-similar-card__img">
                        {s.thumbnail ? (
                          <img src={imgUrl(s.thumbnail)} alt={s.model} />
                        ) : (
                          <span>🚗</span>
                        )}
                      </div>
                      <div className="cd-similar-card__info">
                        <p>{s.brand} {s.model}</p>
                        <p>{s.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cd-right">
            <div className="cd-panel">
              {isRent && (
                <div className="cd-panel__header">
                  <h3>Informacion</h3>
                  <span className="cd-panel__price">
                    €{Number(car.price_per_day).toLocaleString()}
                    <small>/ditë</small>
                  </span>
                </div>
              )}

              {isSale && (
                <div className="cd-panel__header">
                  <h3>Bli këtë makinë</h3>
                  <span className="cd-panel__price">
                    €{Number(car.sale_price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}