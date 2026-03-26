import { useState, useEffect } from "react";
import "../../components/carCard/carCard.css";


export default function CarCard({ car = {} }) {
  const [flipped, setFlipped] = useState(false);

  const {
    brand = "",
    model = "",
    category = "",
    year = "",
    fuel = "",
    transmission = "",
    seats = "",
    color = "",
    status = "",
    type = "",
    price_per_day = "",
    sale_price = "",
    vin = "",
    media = [],
  } = car;

  const fuelLabel =
    fuel === "nafte" ? "Naftë" :
    fuel === "benzin" ? "Benzin" :
    fuel === "elektrike" ? "Elektrike" : "Hybrid";

  const transLabel =
    transmission === "automatic" ? "Automatik" :
    transmission === "manual" ? "Manual" :
    transmission === "semi-automatic" ? "Semi-auto" : "Tiptronic";

  const statusColor =
    status === "available" ? "#10b981" :
    status === "reserved" ? "#f59e0b" :
    status === "sold" ? "#ef4444" : "#6366f1";

  return (
    <div id="card">
      <div className={`carCard ${flipped ? "is-flipped" : ""}`}>

        {/* ===== FRONT ===== */}
        <div className="cardFront">
          <div className="carTypology">
            <span className="car-category-badge">{category}</span>
            <h2>{brand}</h2>
            <h4>{model} · {year}</h4>
          </div>

          <div className="car-image-area">
            {media && media.length > 0 ? (
              <img src={`http://localhost:5000/uploads/${media[0].image_path}`} 
              alt={model}  className="car-real-img" />
            ) : (
              <div className="placeholder">Awaiting image</div>
            )}
          </div>

          <div className="flip">
            <div className="flip-link" onClick={() => setFlipped(true)}>Details</div>
            <div className="flip-price">
              {type === "RENTAL" ? `${price_per_day}€/ditë` : `${sale_price.toLocaleString()}€`}
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div className="cardBack">
          <div className="back-top">
            <span className="back-title">Detajet</span>
            <div className="detailsBtn" onClick={() => setFlipped(false)}>← Kthehu</div>
          </div>

          <div className="back-rows">
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z"/></svg>
                Karburanti
              </div>
              <span>{fuelLabel}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 17 16" fill="currentColor" stroke="currentColor" strokeWidth="0.3"><path d="M13.7127 1.11064V6.74532C13.7121 6.95355 13.629 7.15306 13.4815 7.30005C13.334 7.44704 13.1342 7.52947 12.926 7.5293H8.05V1.09798C8.05 0.9728 8.00027 0.852718 7.91175 0.764201C7.82324 0.675684 7.70318 0.625977 7.578 0.625977C7.45282 0.625977 7.33276 0.675684 7.24425 0.764201C7.15573 0.852718 7.106 0.9728 7.106 1.09798V7.5293H1.44333V1.09798C1.43874 0.975957 1.38704 0.860465 1.29909 0.775757C1.21114 0.691049 1.09378 0.643717 0.971667 0.643717C0.849555 0.643717 0.732196 0.691049 0.644243 0.775757C0.55629 0.860465 0.504588 0.975957 0.5 1.09798V15.5293C0.504588 15.6513 0.55629 15.7668 0.644243 15.8515C0.732196 15.9362 0.849555 15.9984 0.971667 16C1.09378 15.9984 1.21114 15.9362 1.29909 15.8515C1.38704 15.7668 1.43874 15.6513 1.44333 15.5293V8.47062H7.106V15.5293C7.106 15.6545 7.15573 15.7746 7.24425 15.8631C7.33276 15.9516 7.45282 16.0013 7.578 16.0013C7.70318 16.0013 7.82324 15.9516 7.91175 15.8631C8.00027 15.7746 8.05 15.6545 8.05 15.5293V8.47062H12.9233C13.1505 8.47141 13.3756 8.42739 13.5857 8.34106C13.7959 8.25474 13.9869 8.12779 14.1479 7.96753C14.3089 7.80727 14.4367 7.61684 14.524 7.4071C14.6113 7.19737 14.6564 6.9725 14.6567 6.74532V1.09798C14.6567 0.492676 13.7127 0.492676 13.7127 1.11064Z"/></svg>
                Transmisioni
              </div>
              <span>{transLabel}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.2"><path d="M16.9381 23.294C16.9371 21.7738 16.4896 20.2874 15.6511 19.0192C14.8126 17.7509 13.6201 16.7568 12.2215 16.1601C11.2588 15.744 10.221 15.5292 9.17216 15.5298C8.12332 15.5292 7.08548 15.744 6.12277 16.1601C4.72417 16.7568 3.53163 17.7509 2.69315 19.0192C1.85467 20.2874 1.40717 21.7738 1.40618 23.294C1.40461 23.4808 1.32974 23.6595 1.19766 23.7915C1.06558 23.9236 0.886881 23.9984 0.700099 24C0.514283 23.9971 0.336926 23.9215 0.20608 23.7896C0.0752343 23.6576 0.00128471 23.4798 0 23.294C0.00119281 21.6367 0.450563 20.0105 1.30058 18.5876C2.15059 17.1647 3.36963 15.998 4.8286 15.211C5.29586 14.9622 5.78374 14.754 6.28679 14.589C5.65225 14.1327 5.13532 13.5322 4.77867 12.8368C4.42202 12.1414 4.23584 11.371 4.23551 10.5895C4.23684 9.27966 4.75792 8.02398 5.68436 7.09777C6.61081 6.17155 7.86698 5.65054 9.17717 5.64921C10.4873 5.64921 11.7449 6.17155 12.6714 7.09777C13.5978 8.02398 14.1188 9.27966 14.1188 10.5895C14.118 11.3709 13.9317 12.141 13.5751 12.8363C13.2184 13.5317 12.7017 14.1324 12.0675 14.589C12.5707 14.7537 13.0586 14.9619 13.5257 15.211C14.9848 15.9979 16.2039 17.1647 17.0541 18.5876C17.9043 20.0105 18.3539 21.6366 18.3553 23.294C18.3537 23.4808 18.2788 23.6595 18.1467 23.7915C18.0147 23.9236 17.836 23.9984 17.6492 24C17.4614 24 17.2813 23.9257 17.1481 23.7935C17.0149 23.6612 16.9394 23.4817 16.9381 23.294Z"/></svg>
                Ulëset
              </div>
              <span>{seats}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5H4V2H8V5M4 22H8V19H4V22M14 2H10V5H14V2M10 22H14V19H10V22M16 2V5H20V2H16M17 11H13V7H11V11H7V7H5V17H7V13H11V17H13V13H19V7H17V11Z"/></svg>
                VIN
              </div>
              <span className="vin-val">{vin}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.3533 7.85924C22.9866 7.85924 23.5 7.25931 23.5 6.51989V5.33934C23.5 4.59969 22.9868 4 22.3533 4L18.0383 4.00023C17.4051 4.00023 16.8916 4.59968 16.8916 5.33957V6.52012C16.8916 7.25954 17.4049 7.85947 18.0383 7.85947H19.3582V10.9625L12.4305 10.9623C12.1439 10.0537 11.3964 9.40548 10.5195 9.40548H8.55928C7.68214 9.40548 6.93448 10.0535 6.64827 10.9623H5.1422V7.85924H6.46229C7.09534 7.85924 7.60897 7.25931 7.60897 6.51989V5.33934C7.60897 4.59969 7.09534 4 6.46229 4L2.14668 4.00023C1.51362 4.00023 1 4.59968 1 5.33957V6.52012C1 7.25954 1.51362 7.85947 2.14668 7.85947H3.46678V16.2122H2.14668C1.51362 16.2122 1 16.8116 1 17.5515V18.7321C1 19.4717 1.51362 20.0714 2.14668 20.0714H6.46149C7.09454 20.0714 7.60817 19.472 7.60817 18.7321V17.5515C7.60817 16.8119 7.09454 16.2122 6.46149 16.2122H5.14139V12.6038H6.64746C6.93369 13.5128 7.68134 14.1602 8.55847 14.1602H10.5187C11.3958 14.1602 12.1435 13.5121 12.4297 12.6038H19.3584V16.2115H18.0383C17.4051 16.2115 16.8916 16.8109 16.8916 17.5508V18.7314C16.8916 19.471 17.4049 20.0707 18.0383 20.0707H22.3531C22.9864 20.0707 23.4998 19.4715 23.4998 18.7314V17.5508C23.4998 16.8112 22.9866 16.2115 22.3531 16.2115H21.0332L21.0334 7.85935L22.3533 7.85924Z"/></svg>
                Transmisioni tip
              </div>
              <span>{transLabel}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <span className="color-circle" style={{background: color === "black" ? "#111" : color === "white" ? "#eee" : color === "silver" ? "#C0C0C0" : color}}></span>
                Ngjyra
              </div>
              <span>{color}</span>
            </div>
            <div className="back-row">
              <div className="back-label">
                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" fill={statusColor}/></svg>
                Statusi
              </div>
              <span className={`status-pill status-${status}`}>{status}</span>
            </div>
            <div className="back-row">
              <div className="back-label">Cmimi</div>
              <span className="price-accent">
                {type === "RENTAL" ? `${price_per_day}€/ditë` : `${sale_price.toLocaleString()}€`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button className="cardBtn">Reserve</button>
    </div>
  );
}

