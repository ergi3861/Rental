import './navbar.css';
import logo from '../../assets/logo.png';
import ReactCountryFlag from 'react-country-flag';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaCalendarCheck,
  FaTags,
  FaHistory,
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../backendConnection/context';
import AppContext from '../../backendConnection/translationContext';
import axios from 'axios';

const BASE_URL = 'https://rentalbackend-production-5b6c.up.railway.app/';
const API_URL  = 'https://rentalbackend-production-5b6c.up.railway.app/api';

const STATUS_META = {
  available: { color: '#10b981' },
  reserved:  { color: '#f59e0b' },
  sold:      { color: '#ef4444' },
  service:   { color: '#6366f1' },
};
const TYPE_META = {
  RENTAL: { color: '#38bdf8' },
  SALE:   { color: '#a78bfa' },
};

const FB = {
  'nav.search':            'Kerko',
  'nav.searchPlaceholder': 'Kërko makinë...',
  'nav.home':              'Home',
  'nav.cars':              'Makinat',
  'nav.reserve':           'Rezervo',
  'nav.buy':               'Bli një makinë',
  'nav.sell':              'Shit makinën tënde',
  'nav.services':          'Shërbime',
  'nav.about':             'Rreth nesh',
  'nav.contact':           'Kontakto',
  'nav.faq':               'FAQ',
  'carCategories.ekonomike': 'Ekonomike',
  'carCategories.kompakt':   'Kompakt',
  'carCategories.suv':       'SUV',
  'carCategories.luksoze':   'Luksoze',
  'carCategories.elektrike': 'Elektrike',
  'carCategories.hibride':   'Hibride',
  'carDetail.perDay':        '/ditë',
  'carDetail.rental':        'Qira',
  'carDetail.sale':          'Shitje',
  'search.noResults':        'Nuk u gjet asnjë makinë për',
  'search.searchAll':        'Kërko në të gjitha makinat →',
  'search.results':          'rezultate',
  'search.result':           'rezultat',
  'search.viewAll':          'Shiko të gjitha →',
};

const DEFAULT_CURRENCIES = {
  EUR: { symbol: '€', rate: 1,    label: 'Euro',   code: 'EUR' },
  ALL: { symbol: 'L', rate: 110,  label: 'Lekë',   code: 'ALL' },
  USD: { symbol: '$', rate: 1.08, label: 'Dollar',  code: 'USD' },
  GBP: { symbol: '£', rate: 0.86, label: 'GBP',    code: 'GBP' },
};

function useDebounce(value, delay = 350) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return dv;
}

function LangDropdown() {
  const ctx        = useContext(AppContext);
  const lang       = ctx?.lang       ?? 'sq';
  const changeLang = ctx?.changeLang ?? (() => {});
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const langs = [
    { code: 'sq', countryCode: 'AL', label: 'Shqip' },
    { code: 'en', countryCode: 'GB', label: 'EN' },
    { code: 'it', countryCode: 'IT', label: 'IT' },
    { code: 'fr', countryCode: 'FR', label: 'FR' },
  ];

  useEffect(() => {
    const fn = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const current = langs.find((l) => l.code === lang) || langs[0];

  return (
    <div ref={ref} className="selectorDropdown">
      <div className="selectorHover">
        <div className="selectorTrigger" onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
          <div className="selectorIcons">
            <div className="icon isActive">
              <ReactCountryFlag countryCode={current.countryCode} svg />
            </div>
          </div>
          <div className="selectorLabel"><span>{current.label}</span></div>
        </div>
        {open && (
          <div className="selectorMenu">
            {langs.map((l) => (
              <div
                key={l.code}
                className={`option ${lang === l.code ? 'active' : ''}`}
                onClick={() => { changeLang(l.code); setOpen(false); }}
              >
                <div className="optionIcon"><ReactCountryFlag countryCode={l.countryCode} svg /></div>
                <div className="optionLabel">{l.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CurrencyDropdown() {
  const ctx             = useContext(AppContext);
  const currency        = ctx?.currency        ?? 'EUR';
  const changeCurrency  = ctx?.changeCurrency  ?? (() => {});
  const currencyOptions = ctx?.currencyOptions ?? DEFAULT_CURRENCIES;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = Object.entries(currencyOptions).map(([code, cfg]) => ({ code, ...cfg }));
  const current = currencyOptions[currency] ?? DEFAULT_CURRENCIES.EUR;

  useEffect(() => {
    const fn = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} className="selectorDropdown">
      <div className="selectorHover">
        <div className="selectorTrigger" onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
          <div className="selectorIcons">
            <div className="icon isActive">{current.symbol}</div>
          </div>
          <div className="selectorLabel"><span>{current.code}</span></div>
        </div>
        {open && (
          <div className="selectorMenu">
            {options.map((opt) => (
              <div
                key={opt.code}
                className={`option ${currency === opt.code ? 'active' : ''}`}
                onClick={() => { changeCurrency(opt.code); setOpen(false); }}
              >
                <div className="optionIcon">{opt.symbol}</div>
                <div className="optionLabel">{opt.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const ctx = useContext(AppContext);
  const t   = ctx?.t ?? ((key) => FB[key] ?? key.split('.').pop());

  const PATHS = {
    search: 'M11 19a8 8 0 1 1 5.3-14.1A8 8 0 0 1 11 19zm8.9 2.2-3.4-3.4',
    close:  'M6 6l12 12M18 6l-12 12',
    arrow:  'M5 12h12M13 6l6 6-6 6',
  };

  const placeholderRef = useRef(null);
  const inputRef       = useRef(null);
  const iconPathRef    = useRef(null);
  const actionPathRef  = useRef(null);
  const dropdownRef    = useRef(null);

  const [state,   setState]   = useState('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(0);
  const [open,    setOpen]    = useState(false);

  const debounced = useDebounce(query, 350);

  // ── Kërkim + logging ─────────────────────────────────────
  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      // Kërkim makinash
      axios.get(
        `${API_URL}/cars?search=${encodeURIComponent(debounced)}&limit=8`
      ),
      // ✅ Logo kërkimin (silent — nuk bllokon)
      axios.post(
        `${API_URL}/search/log`,
        { query: debounced },
        { headers }
      ).catch(() => {}),
    ])
      .then(([{ data }]) => {
        const cars = data.data || data.rows || [];
        setResults({ cars, total: cars.length, q: debounced });
        setOpen(true);
        setFocused(0);
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    if (!dropdownRef.current) return;
    const focused_el = dropdownRef.current.querySelector('.searchResultItemFocused');
    if (focused_el) focused_el.scrollIntoView({ block: 'nearest' });
  }, [focused]);

  useEffect(() => {
    const fn = (e) => {
      if (!placeholderRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  function morph(path, newD) {
    if (!path || path.getAttribute('d') === newD) return;
    path.style.opacity   = '0.3';
    path.style.transform = 'rotate(-6deg)';
    setTimeout(() => {
      path.setAttribute('d', newD);
      path.style.opacity   = '1';
      path.style.transform = 'rotate(0deg)';
    }, 140);
  }

  function openSearch() {
    if (state !== 'idle') return;
    document.body.classList.add('searchIsOpen');
    document.body.style.overflow = 'hidden';
    setState('expanding');
    setExpanded(true);
    setTimeout(() => {
      morph(iconPathRef.current, PATHS.close);
      if (actionPathRef.current) actionPathRef.current.setAttribute('d', PATHS.close);
      setState('active');
      if (inputRef.current) inputRef.current.focus();
    }, 60);
  }

  function closeSearch() {
    if (state === 'idle') return;
    document.body.classList.remove('searchIsOpen');
    document.body.style.overflow = '';
    setState('closing');
    setExpanded(false);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.blur();
    }
    setQuery('');
    setResults(null);
    setOpen(false);
    morph(iconPathRef.current, PATHS.search);
    if (actionPathRef.current) actionPathRef.current.setAttribute('d', '');
    setTimeout(() => setState('idle'), 500);
  }

  function updateIcon() {
    const val = inputRef.current.value;
    setQuery(val);
    if (val.length > 0) {
      morph(iconPathRef.current, PATHS.arrow);
      if (actionPathRef.current) actionPathRef.current.setAttribute('d', PATHS.arrow);
      setState('populated');
    } else {
      morph(iconPathRef.current, PATHS.close);
      if (actionPathRef.current) actionPathRef.current.setAttribute('d', PATHS.close);
      setState('active');
      setResults(null);
      setOpen(false);
    }
  }

  function goToCar(id) {
    closeSearch();
    navigate(`/cars/${id}`);
  }

  function goToSearch(q) {
    closeSearch();
    navigate(`/cars?search=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { closeSearch(); return; }
    const cars = results?.cars || [];
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cars.length > 0 && focused < cars.length) goToCar(cars[focused].id);
      else {
        const val = inputRef.current?.value?.trim();
        if (val) goToSearch(val);
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((f) => Math.min(f + 1, cars.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused((f) => Math.max(f - 1, 0)); }
  }

  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') closeSearch(); }
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  });

  const hasCars = results?.cars?.length > 0;

  const searchPortal = createPortal(
    <>
      <div
        className={`searchOverlay${expanded ? ' searchOverlayIsActive' : ''}`}
        onClick={closeSearch}
      />
      <div className={`searchShellPortal${expanded ? ' searchShellPortalExpanded' : ''}`}>
        <div className="searchGroup">
          <span className="searchLabel">
            {loading ? <span className="searchLoadingDot" /> : t('nav.search')}
          </span>
          <div className="searchIcon">
            <svg viewBox="0 0 26 24">
              <path ref={iconPathRef} d={PATHS.search} />
            </svg>
          </div>
        </div>

        <input
          className="searchInput"
          ref={inputRef}
          onInput={updateIcon}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder={t('nav.searchPlaceholder')}
        />

        <div
          className="searchActionIcon searchIcon"
          onClick={(e) => {
            e.stopPropagation();
            const val = inputRef.current?.value?.trim();
            if (state === 'active' || state === 'expanding') { closeSearch(); return; }
            if (state === 'populated' && val) {
              const car = results?.cars?.[focused];
              car ? goToCar(car.id) : goToSearch(val);
            }
          }}
        >
          <svg viewBox="0 0 24 24">
            <path ref={actionPathRef} />
          </svg>
        </div>

        {open && (
          <div className="searchResults" ref={dropdownRef}>
            {!hasCars && !loading && (
              <div className="searchResultsEmpty">
                <span>🔍</span>
                <p>{t('search.noResults')} <strong>"{debounced}"</strong></p>
                <button className="searchResultsAllBtn" onClick={() => goToSearch(debounced)}>
                  {t('search.searchAll')}
                </button>
              </div>
            )}
            {hasCars && (
              <>
                <div className="searchResultsLabel">
                  {results.total} {results.total !== 1 ? t('search.results') : t('search.result')}
                </div>
                {results.cars.map((car, i) => {
                  const sm  = STATUS_META[car.status] || { color: '#94a3b8' };
                  const tm  = TYPE_META[car.type]     || { color: '#94a3b8' };
                  const src = car.thumbnail
                    ? `${BASE_URL}${car.thumbnail}`
                    : car.media?.[0]?.image_path
                      ? `${BASE_URL}${car.media[0].image_path}`
                      : null;
                  const price =
                    car.type === 'RENTAL'
                      ? `€${Number(car.price_per_day).toLocaleString()}${t('carDetail.perDay')}`
                      : `€${Number(car.sale_price).toLocaleString()}`;
                  return (
                    <div
                      key={car.id}
                      className={`searchResultItem${focused === i ? ' searchResultItemFocused' : ''}`}
                      onClick={() => goToCar(car.id)}
                      onMouseEnter={() => setFocused(i)}
                    >
                      <div className="searchResultImg">
                        {src ? <img src={src} alt={car.model} /> : <span>🚗</span>}
                      </div>
                      <div className="searchResultInfo">
                        <span className="searchResultName">
                          {(car.brand || '').charAt(0).toUpperCase() + (car.brand || '').slice(1)}{' '}
                          {car.model}
                        </span>
                        <span className="searchResultMeta">
                          {car.year} · {t(`fuel.${car.fuel}`) || car.fuel} · {car.category}
                        </span>
                      </div>
                      <div className="searchResultRight">
                        <span className="searchResultPrice">{price}</span>
                        <div className="searchResultBadges">
                          <span
                            className="searchResultBadge"
                            style={{ background: tm.color + '22', color: tm.color }}
                          >
                            {car.type === 'RENTAL' ? t('carDetail.rental') : t('carDetail.sale')}
                          </span>
                          <span
                            className="searchResultBadge"
                            style={{ background: sm.color + '22', color: sm.color }}
                          >
                            {t(`carDetail.${car.status}`) || car.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="searchResultsFooter">
                  <button className="searchResultsAllBtn" onClick={() => goToSearch(debounced)}>
                    {t('search.viewAll')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>,
    document.body
  );

  return (
    <>
      {searchPortal}
      <nav id="navbar">
        <div className="navBarTop">
          <div className="textLogo">
            <h2>Rental &<br />Sales</h2>
          </div>
          <div className="navBarContent">
            <div className="contactLinks">
              <a href="tel:+355691234567"><FaPhoneAlt /></a>
              <a href="mailto:rental@rental.com"><FaEnvelope /></a>
              <a href="https://wa.me/355691234567" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            </div>
            <div className="selectorGroup">
              <LangDropdown />
              <CurrencyDropdown />
            </div>
            <div ref={placeholderRef} className="searchPlaceholder" onClick={openSearch}>
              {state === 'idle' && (
                <div className="searchPlaceholderInner">
                  <span className="searchLabel">{t('nav.search')}</span>
                  <div className="searchIcon">
                    <svg viewBox="0 0 26 24"><path d={PATHS.search} /></svg>
                  </div>
                </div>
              )}
            </div>
            <div className="quickStats">
              <button className="statBtn" onClick={() => navigate('/reservation')}><FaCalendarCheck /></button>
              <button className="statBtn" onClick={() => navigate('/sales')}><FaTags /></button>
              <button className="statBtn" onClick={() => navigate(isAuthenticated ? '/profile' : '/auth')}><FaHistory /></button>
            </div>
            <div className="authentication">
              <div className="userMenu">
                <button
                  className="userBtn"
                  onClick={() => navigate(isAuthenticated ? '/profile' : '/auth')}
                  aria-label="Login / Sign up"
                >
                  {isAuthenticated ? (
                    <span className="userInitials">
                      {(user?.first_name?.[0] || '').toUpperCase()}
                      {(user?.last_name?.[0] || '').toUpperCase()}
                    </span>
                  ) : (
                    <FontAwesomeIcon icon={faUserPlus} className="userIcon" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="navBarMain">
          <div className="logo">
            <Link to="/"><img src={logo} alt="logo" /></Link>
          </div>
          <button className="mobileMenuBtn" onClick={() => setMenuOpen(p => !p)}>
  {menuOpen ? '✕' : '☰'}
</button>
<ul className={`menu${menuOpen ? ' menuOpen' : ''}`}></ul>
          <ul className="menu">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li className="hasDropdown">
              <Link to="/cars">{t('nav.cars')}</Link>
              <ul className="dropdownMenu">
                <li><Link to="/cars?category=Ekonomike">{t('carCategories.ekonomike')}</Link></li>
                <li><Link to="/cars?category=Kompakt">{t('carCategories.kompakt')}</Link></li>
                <li><Link to="/cars?category=SUV">{t('carCategories.suv')}</Link></li>
                <li><Link to="/cars?category=Luksoze">{t('carCategories.luksoze')}</Link></li>
                <li><Link to="/cars?category=Elektrike">{t('carCategories.elektrike')}</Link></li>
                <li><Link to="/cars?category=Hibride">{t('carCategories.hibride')}</Link></li>
              </ul>
            </li>
            <li><Link to="/rental">{t('nav.reserve')}</Link></li>
            <li><Link to="/sales">{t('nav.buy')}</Link></li>
            <li><Link to="/buy">{t('nav.sell')}</Link></li>
            <li><Link to="/services">{t('nav.services')}</Link></li>
            <li><Link to="/aboutUs">{t('nav.about')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
            <li><Link to="/faq">{t('nav.faq')}</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
}