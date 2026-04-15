import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../backendConnection/api';
import { useAuth } from '../../backendConnection/context';
import '../reservationForm/reservationForm.css';

const Locations = ['Tirana Center', 'Tirana Airport', 'Durres Port', 'Vlore Downtown'];
const Times     = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const Office    = 'Tirana Airport';
const Delivery  = 15;
const today     = new Date().toISOString().split('T')[0];

const Initial = {
  pickupLocation: '',
  pickupDate:     '',
  pickupTime:     '',
  dropLocation:   '',
  dropDate:       '',
  dropTime:       '',
};

function LoginPopup({ onClose, onLogin }) {
  return (
    <div className="loginPopupOverlay" onClick={onClose}>
      <div className="loginPopup" onClick={(e) => e.stopPropagation()}>
        <button className="loginPopupClose" onClick={onClose}>✕</button>
        <div className="loginPopupIcon">🔐</div>
        <h3 className="loginPopupTitle">Kërkohet Hyrja</h3>
        <p className="loginPopupSub">
          Duhet të jeni të kyçur për të bërë një rezervim.
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

export default function ReservationForm({ car }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form,        setForm]        = useState(Initial);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [serverError, setServerError] = useState('');
  const [showLogin,   setShowLogin]   = useState(false);

  const summary = useMemo(() => {
    if (!car) return null;
    if (!form.pickupDate || !form.dropDate || !form.pickupTime || !form.dropTime) return null;

    const start = new Date(`${form.pickupDate} ${form.pickupTime}`);
    const end   = new Date(`${form.dropDate} ${form.dropTime}`);
    if (end <= start) return null;

    const days         = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const base_price   = parseFloat(((car.price_per_day || 0) * days).toFixed(2));
    const delivery_fee = form.pickupLocation !== Office || form.dropLocation !== Office ? Delivery : 0;
    const total_price  = parseFloat((base_price + delivery_fee).toFixed(2));

    return { days, base_price, delivery_fee, total_price };
  }, [form, car]);

  if (!car) return null;

  const updateField = (f) => (v) => {
    setForm((p)   => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.pickupLocation) e.pickupLocation = 'Kërkohet';
    if (!form.pickupDate)     e.pickupDate     = 'Kërkohet';
    if (!form.pickupTime)     e.pickupTime     = 'Kërkohet';
    if (!form.dropLocation)   e.dropLocation   = 'Kërkohet';
    if (!form.dropDate)       e.dropDate       = 'Kërkohet';
    if (!form.dropTime)       e.dropTime       = 'Kërkohet';
    if (summary === null && form.pickupDate && form.dropDate) {
      e.dropDate = 'Data e kthimit duhet të jetë pas marrjes';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    try {
      const res = await API.post('/reservations', {
        car_id:        car.id,
        price_per_day: car.price_per_day,
        ...form,
      });
      setResult(res.data);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/auth');
  };

  return (
    <div id="reservationForm">
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onLogin={goToLogin}
        />
      )}

      <div className="resOverlay">
        <div className="resHeader">
          <div>
            <span className="resCar">{car.brand} {car.model} · {car.year}</span>
            <span className="resPrice">{car.price_per_day}€/ditë</span>
          </div>
        </div>

        {result ? (
          <div className="resSuccess">
            <div className="resSuccessIcon">✓</div>
            <h3>Rezervimi u krye!</h3>
            <p>Makina u kalua në status "E rezervuar".</p>
            <div className="resReceipt">
              <div className="resReceiptRow">
                <span>Qira bazë ({result.days} ditë)</span>
                <span>{result.base_price}€</span>
              </div>
              {result.delivery_fee > 0 && (
                <div className="resReceiptRow">
                  <span>Tarifë dorëzimi</span>
                  <span>{result.delivery_fee}€</span>
                </div>
              )}
              <div className="resReceiptRow resReceiptTotal">
                <span>Total</span>
                <span>{result.total_price}€</span>
              </div>
            </div>
            <button
              className="resSubmit"
              style={{ marginTop: '16px' }}
              onClick={() => setResult(null)}
            >
              Rezervo sërish
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="resSectionLabel">Marrja</div>
            <div className="resGrid">
              <div className="resField resSpan2">
                <label>Vendndodhja e marrjes *</label>
                <select
                  value={form.pickupLocation}
                  onChange={(e) => updateField('pickupLocation')(e.target.value)}
                >
                  <option value="">-- Zgjidh --</option>
                  {Locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.pickupLocation && <span className="resError">{errors.pickupLocation}</span>}
                {form.pickupLocation && form.pickupLocation !== Office && (
                  <span className="resDeliveryNote">+{Delivery}€ tarifë dorëzimi</span>
                )}
              </div>
              <div className="resField">
                <label>Data e marrjes *</label>
                <input
                  type="date"
                  min={today}
                  value={form.pickupDate}
                  onChange={(e) => updateField('pickupDate')(e.target.value)}
                />
                {errors.pickupDate && <span className="resError">{errors.pickupDate}</span>}
              </div>
              <div className="resField">
                <label>Ora e marrjes *</label>
                <select
                  value={form.pickupTime}
                  onChange={(e) => updateField('pickupTime')(e.target.value)}
                >
                  <option value="">-- Zgjidh --</option>
                  {Times.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.pickupTime && <span className="resError">{errors.pickupTime}</span>}
              </div>
            </div>

            <div className="resSectionLabel">Kthimi</div>
            <div className="resGrid">
              <div className="resField resSpan2">
                <label>Vendndodhja e kthimit *</label>
                <select
                  value={form.dropLocation}
                  onChange={(e) => updateField('dropLocation')(e.target.value)}
                >
                  <option value="">-- Zgjidh --</option>
                  {Locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.dropLocation && <span className="resError">{errors.dropLocation}</span>}
                {form.dropLocation && form.dropLocation !== Office && (
                  <span className="resDeliveryNote">+{Delivery}€ tarifë dorëzimi</span>
                )}
              </div>
              <div className="resField">
                <label>Data e kthimit *</label>
                <input
                  type="date"
                  min={form.pickupDate || today}
                  value={form.dropDate}
                  onChange={(e) => updateField('dropDate')(e.target.value)}
                />
                {errors.dropDate && <span className="resError">{errors.dropDate}</span>}
              </div>
              <div className="resField">
                <label>Ora e kthimit *</label>
                <select
                  value={form.dropTime}
                  onChange={(e) => updateField('dropTime')(e.target.value)}
                >
                  <option value="">-- Zgjidh --</option>
                  {Times.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.dropTime && <span className="resError">{errors.dropTime}</span>}
              </div>
            </div>

            {summary && (
              <div className="resSummary">
                <div className="resSummaryRow">
                  <span>{car.price_per_day}€ × {summary.days} ditë</span>
                  <span>{summary.base_price}€</span>
                </div>
                {summary.delivery_fee > 0 && (
                  <div className="resSummaryRow">
                    <span>Tarifë dorëzimi</span>
                    <span>+{summary.delivery_fee}€</span>
                  </div>
                )}
                <div className="resSummaryRow resSummaryTotal">
                  <span>Total</span>
                  <span>{summary.total_price}€</span>
                </div>
              </div>
            )}

            {serverError && <p className="resServerError">{serverError}</p>}

            <button type="submit" className="resSubmit" disabled={loading}>
              {loading ? 'Duke rezervuar...' : 'Konfirmo Rezervimin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}