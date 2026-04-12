import '../carCard/carCard.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationForm from '../reservationForm/reservationForm';

export default function CarCard({ car = {} }) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const autoRef = useRef();

  const {
    brand = '',
    model = '',
    category = '',
    year = '',
    fuel = '',
    transmission = '',
    seats = '',
    color = '',
    status = '',
    type = '',
    doors = '',
    price_per_day = '',
    sale_price = '',
    media = [],
  } = car;

  useEffect(() => {
    if (media.length <= 1) return;

    autoRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % media.length);
    }, 3000);

    return () => clearInterval(autoRef.current);
  }, [media.length]);

  const goTo = (idx) => {
    clearInterval(autoRef.current);
    setImgIndex(idx);
    autoRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % media.length);
    }, 3000);
  };

  const prev = (e) => {
    e.stopPropagation();
    goTo((imgIndex - 1 + media.length) % media.length);
  };

  const next = (e) => {
    e.stopPropagation();
    goTo((imgIndex + 1) % media.length);
  };

  const fuelLabel =
    fuel === 'nafte'
      ? 'Naftë'
      : fuel === 'benzin'
        ? 'Benzin'
        : fuel === 'elektrike'
          ? 'Elektrike'
          : 'Hybrid';

  const transLabel =
    transmission === 'automatic'
      ? 'Automatik'
      : transmission === 'manual'
        ? 'Manual'
        : transmission === 'semi-automatic'
          ? 'Semi-auto'
          : 'Tiptronic';

  const statusColor =
    status === 'available'
      ? '#10b981'
      : status === 'reserved'
        ? '#f59e0b'
        : status === 'sold'
          ? '#ef4444'
          : '#6366f1';

  const isAvailable = status === 'available';

  return (
    <>
      <div id="carCard">
        <div className={`carCard ${flipped ? 'isFlipped' : ''}`}>
          <div className="cardFront">
            <div className="carTypology">
              <span>{category}</span>
              <h2>{brand}</h2>
              <h4>
                {model} · {year}
              </h4>
            </div>

            <div className="carImage">
              {media.length > 0 ? (
                <div className="carousel">
                  <img
                    key={imgIndex}
                    src={`http://localhost:5000/uploads/${media[imgIndex]}`}
                    alt={model}
                    className="carImg carouselImg"
                  />
                  {media.length > 1 && (
                    <>
                      <button className="arrow left" onClick={prev}>
                        ‹
                      </button>
                      <button className="arrow right" onClick={next}>
                        ›
                      </button>
                      <div className="carouselDots">
                        {media.map((_, i) => (
                          <button
                            key={i}
                            className={`carouselDot ${i === imgIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              goTo(i);
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="placeholder">Awaiting image</div>
              )}
            </div>

            <div className="flip">
              <div className="flipLink" onClick={() => setFlipped(true)}>
                Details
              </div>
              <div className="price">
                {type === 'RENTAL'
                  ? `${price_per_day}ALL/dite`
                  : `${Number(sale_price).toLocaleString()}ALL`}
              </div>
            </div>
          </div>

          <div className="cardBack">
            <div className="backTop">
              <span className="backTitle">Detajet</span>
              <div className="detailsBtn" onClick={() => setFlipped(false)}>
                ← Kthehu
              </div>
            </div>

            <div className="details">
              <div className="detail">
                <div className="detailLabel">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z" />
                  </svg>
                  Karburanti
                </div>
                <span>{fuelLabel}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">
                  <svg
                    viewBox="0 0 17 16"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.3"
                  >
                    <path d="M13.7127 1.11064V6.74532C13.7121 6.95355 13.629 7.15306 13.4815 7.30005C13.334 7.44704 13.1342 7.52947 12.926 7.5293H8.05V1.09798C8.05 0.9728 8.00027 0.852718 7.91175 0.764201C7.82324 0.675684 7.70318 0.625977 7.578 0.625977C7.45282 0.625977 7.33276 0.675684 7.24425 0.764201C7.15573 0.852718 7.106 0.9728 7.106 1.09798V7.5293H1.44333V1.09798C1.43874 0.975957 1.38704 0.860465 1.29909 0.775757C1.21114 0.691049 1.09378 0.643717 0.971667 0.643717C0.849555 0.643717 0.732196 0.691049 0.644243 0.775757C0.55629 0.860465 0.504588 0.975957 0.5 1.09798V15.5293C0.504588 15.6513 0.55629 15.7668 0.644243 15.8515C0.732196 15.9362 0.849555 15.9984 0.971667 16C1.09378 15.9984 1.21114 15.9362 1.29909 15.8515C1.38704 15.7668 1.43874 15.6513 1.44333 15.5293V8.47062H7.106V15.5293C7.106 15.6545 7.15573 15.7746 7.24425 15.8631C7.33276 15.9516 7.45282 16.0013 7.578 16.0013C7.70318 16.0013 7.82324 15.9516 7.91175 15.8631C8.00027 15.7746 8.05 15.6545 8.05 15.5293V8.47062H12.9233C13.1505 8.47141 13.3756 8.42739 13.5857 8.34106C13.7959 8.25474 13.9869 8.12779 14.1479 7.96753C14.3089 7.80727 14.4367 7.61684 14.524 7.4071C14.6113 7.19737 14.6564 6.9725 14.6567 6.74532V1.09798C14.6567 0.492676 13.7127 0.492676 13.7127 1.11064Z" />
                  </svg>
                  Transmisioni
                </div>
                <span>{transLabel}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,4C16,2.89 15.1,2 14,2H10C8.89,2 8,2.89 8,4V6H2V8H3V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8H22V6H16V4M10,4H14V6H10V4M11,10H13V18H11V10M7,10H9V18H7V10M15,10H17V18H15V10Z" />
                  </svg>
                  Uleset
                </div>
                <span>{seats}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 19V7.5L9 4h9a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
                    <path d="M8.5 4.5V9.5h9.5" />
                    <line x1="15" y1="13.5" x2="18" y2="13.5" />
                    <circle cx="5.8" cy="8" r="0.5" fill="currentColor" stroke="none" />
                    <circle cx="5.8" cy="16" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                  Dyert
                </div>
                <span>{doors}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">
                  <span
                    className="colorCircle"
                    style={{
                      background:
                        color === 'black'
                          ? '#111'
                          : color === 'white'
                            ? '#eee'
                            : color === 'silver'
                              ? '#C0C0C0'
                              : color,
                    }}
                  />
                  Ngjyra
                </div>
                <span>{color}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5" fill={statusColor} />
                  </svg>
                  Statusi
                </div>
                <span className={`statusPill status-${status}`}>{status}</span>
              </div>

              <div className="detail">
                <div className="detailLabel">Cmimi</div>
                <span className="detailPrice">
                  {type === 'RENTAL'
                    ? `${price_per_day}ALL/Dite`
                    : `${Number(sale_price).toLocaleString()}ALL`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {type === 'RENTAL' ? (
          <button
            className={`cardBtn ${isAvailable ? 'cardBtnDisabled' : ''}`}
            onClick={() => isAvailable && setShowModal(true)}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Reserve' : 'E rezervuar'}
          </button>
        ) : (
          <button className="cardBtn cardBtnSale" onClick={() => navigate(`/cars/${car.id}`)}>
            Shiko detajet
          </button>
        )}
      </div>

      {showModal && car && <ReservationForm car={car} onClose={() => setShowModal(false)} />}
    </>
  );
}
