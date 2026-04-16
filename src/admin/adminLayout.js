import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../backendConnection/context';
import adminAPI from './adminAPI';
import './admin.css';

const Nav = [
  { path: '/admin',               label: 'Dashboard',       icon: '📊', exact: true  },
  { path: '/admin/cars',          label: 'Makinat',         icon: '🚗', exact: false },
  { path: '/admin/reservations',  label: 'Rezervimet',      icon: '📋', exact: false },
  { path: '/admin/sell-requests', label: 'Kërkesat shitje', icon: '🤝', exact: false },
  { path: '/admin/users',         label: 'Userat',          icon: '👥', exact: false },
  { path: '/admin/contacts',      label: 'Kontaktet',       icon: '✉️', exact: false },
  { path: '/admin/searchLogs',    label: 'Kërkimet',        icon: '🔍', exact: false }, 
  { path: '/admin/auditLogs',     label: 'Veprimet',        icon: 'AL', exact: false }
];

function useDebounce(value, delay = 20) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

function GlobalSearch() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    adminAPI
      .get(`/search?q=${encodeURIComponent(debounced)}`)
      .then(({ data }) => {
        setResults(data);
        setOpen(true);
        setFocused(0);
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(!!results);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [results]);

  const goTo = useCallback(
    (path) => {
      setOpen(false);
      setQuery('');
      setResults(null);
      navigate(path);
    },
    [navigate]
  );

  const flatItems = useCallback(() => {
    if (!results) return [];
    const items = [];
    results.cars?.forEach((c) => items.push({ path: `/admin/cars/${c.id}/edit` }));
    results.users?.forEach(() => items.push({ path: '/admin/users' }));
    results.reservations?.forEach(() => items.push({ path: '/admin/reservations' }));
    results.sellRequests?.forEach(() => items.push({ path: '/admin/sell-requests' }));
    results.contacts?.forEach(() => items.push({ path: '/admin/contacts' }));
    results.searchLogs?.forEach(() => items.push({ path: '/admin/searchLogs'}))
    results.auditLogs?.forEach(() => items.push({ path: '/admin/auditLogs'}))
    return items;
  }, [results]);

  const handleKeyDown = (e) => {
    const items = flatItems();
    if (!open || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused((f) => Math.min(f + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused((f) => Math.max(f - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[focused];
      if (item) goTo(item.path);
    }
  };

  const fmt = (dt) =>
    dt ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short' }) : '';

  const hasResults =
    results &&
    (results.cars?.length > 0 ||
      results.users?.length > 0 ||
      results.reservations?.length > 0 ||
      results.sellRequests?.length > 0 ||
      results.contacts?.length > 0 || 
      results.searchLogs?.length > 0);

  const carsLen = results?.cars?.length || 0;
  const usersLen = results?.users?.length || 0;
  const resLen = results?.reservations?.length || 0;
  const sellLen = results?.sellRequests?.length || 0;

  return (
    <div id="globalSearch">
      <div className={`globalSearchInputWrap ${open ? 'globalSearchInputWrapOpen' : ''}`}>
        <span className="globalSearchIcon">
          {loading ? <span className="globalSearchSpinner" /> : '🔍'}
        </span>
        <input
          ref={inputRef}
          className="globalSearchInput"
          type="text"
          placeholder="Kërko gjithçka...  ⌘K"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {query && (
          <button
            className="globalSearchClear"
            onClick={() => {
              setQuery('');
              setResults(null);
              setOpen(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className="globalSearchDropdown" ref={dropdownRef}>
          {!hasResults && !loading && (
            <div className="globalSearchEmpty">
              Nuk u gjetën rezultate për <strong>"{debounced}"</strong>
            </div>
          )}

          {results?.cars?.length > 0 && (
            <div className="globalSearchGroup">
              <div className="globalSearchGroupLabel">🚗 Makinat</div>
              {results.cars.map((car, i) => (
                <div
                  key={car.id}
                  className={`globalSearchItem ${focused === i ? 'globalSearchItemFocused' : ''}`}
                  onClick={() => goTo(`/admin/cars/${car.id}/edit`)}
                >
                  <div className="globalSearchItemMain">
                    <span className="globalSearchItemTitle">
                      {car.brand.charAt(0).toUpperCase() + car.brand.slice(1)} {car.model}
                    </span>
                    <span className="globalSearchItemMeta">
                      {car.year} · {car.vin}
                    </span>
                  </div>
                  <span
                    className="globalSearchItemBadge"
                    style={{ color: car.type === 'RENTAL' ? '#38bdf8' : '#a78bfa' }}
                  >
                    {car.type === 'RENTAL' ? 'Qira' : 'Shitje'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {results?.users?.length > 0 && (
            <div className="globalSearchGroup">
              <div className="globalSearchGroupLabel">👥 Userat</div>
              {results.users.map((u, i) => {
                const idx = carsLen + i;
                return (
                  <div
                    key={u.id}
                    className={`globalSearchItem ${focused === idx ? 'globalSearchItemFocused' : ''}`}
                    onClick={() => goTo('/admin/users')}
                  >
                    <div className="globalSearchItemAvatar">
                      {(u.first_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="globalSearchItemMain">
                      <span className="globalSearchItemTitle">
                        {u.first_name} {u.last_name}
                      </span>
                      <span className="globalSearchItemMeta">{u.email}</span>
                    </div>
                    <span
                      className="globalSearchItemBadge"
                      style={{ color: u.role === 'admin' ? '#a78bfa' : '#64748b' }}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {results?.reservations?.length > 0 && (
            <div className="globalSearchGroup">
              <div className="globalSearchLabel">📋 Rezervimet</div>
              {results.reservations.map((r, i) => {
                const idx = carsLen + usersLen + i;
                return (
                  <div
                    key={r.id}
                    className={`globalSearchItem ${focused === idx ? 'globalSearchItemFocused' : ''}`}
                    onClick={() => goTo('/admin/reservations')}
                  >
                    <div className="globalSearchItemMain">
                      <span className="globalSearchItemTitle">
                        {r.first_name} {r.last_name} — {r.brand} {r.model}
                      </span>
                      <span className="globalSearchItemMeta">
                        {fmt(r.start_datetime)} → {fmt(r.end_datetime)} · €
                        {Number(r.total_price || 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="globalSearchItemBadge" style={{ color: '#f59e0b' }}>
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {results?.sellRequests?.length > 0 && (
            <div className="globalSearchGroup">
              <div className="globalSearchGroupLabel">🤝 Kërkesat shitje</div>
              {results.sellRequests.map((s, i) => {
                const idx = carsLen + usersLen + resLen + i;
                return (
                  <div
                    key={s.id}
                    className={`globalSearchItem ${focused === idx ? 'globalSearchItemFocused' : ''}`}
                    onClick={() => goTo('/admin/sell-requests')}
                  >
                    <div className="globalSearchItemMain">
                      <span className="globalSearchItemTitle">
                        {s.name} — {s.brand} {s.model} ({s.year})
                      </span>
                      <span className="globalSearchItemMeta">
                        {s.city} · {s.phone}
                        {s.asking_price ? ` · €${Number(s.asking_price).toLocaleString()}` : ''}
                      </span>
                    </div>
                    <span className="globalSearchItemBadge" style={{ color: '#fb923c' }}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {results?.contacts?.length > 0 && (
            <div className="globalSearchGroup">
              <div className="globalSearchGroupLabel">✉️ Kontaktet</div>
              {results.contacts.map((c, i) => {
                const idx = carsLen + usersLen + resLen + sellLen + i;
                return (
                  <div
                    key={c.id}
                    className={`globalSearchItem ${focused === idx ? 'globalSearchItemFocused' : ''}`}
                    onClick={() => goTo('/admin/contacts')}
                  >
                    <div className="globalSearchItemMain">
                      <span className="globalSearchItemTitle">
                        {c.emri} {c.mbiemri}
                      </span>
                      <span className="globalSearchItemMeta">
                        {c.email} · {c.message_preview}...
                      </span>
                    </div>
                    <span className="globalSearchItemBadge" style={{ color: '#fbbf24' }}>
                      {fmt(c.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {hasResults && (
            <div className="globalSearchFooter">
              {results.total} rezultate për <strong>"{debounced}"</strong>
              <span className="globalSearchFooterHint">↑↓ navigim · ↵ hap</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const initials =
    (user?.firstName?.[0] || user?.first_name?.[0] || 'A').toUpperCase() +
    (user?.lastName?.[0] || user?.last_name?.[0] || '').toUpperCase();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : `${user?.first_name || ''} ${user?.last_name || ''}`.trim();

  return (
    <div id="adminLayout">
      <div className={`adminLayoutWrap ${collapsed ? 'adminLayoutCollapsed' : ''}`}>
        <aside className="adminLayoutSidebar">
          <div className="adminLayoutSidebarTop">
            <div className="adminLayoutLogo">{collapsed ? 'A' : 'Admin Panel'}</div>
            <button className="adminLayoutCollapseBtn" onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? '→' : '←'}
            </button>
          </div>

          <nav className="adminLayoutNav">
            {Nav.map((item) => (
              <button
                key={item.path}
                className={`adminLayoutNavItem ${isActive(item) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ''}
              >
                <span className="adminLayoutNavIcon">{item.icon}</span>
                {!collapsed && <span className="adminLayoutNavLabel">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="adminLayoutSidebarBottom">
            <div className="adminLayoutAdminInfo">
              <div className="adminLayoutAdminAvatar">{initials}</div>
              {!collapsed && (
                <div>
                  <p className="adminLayoutAdminName">{fullName}</p>
                  <p className="adminLayoutAdminRole">{user?.role}</p>
                </div>
              )}
            </div>
            <button className="adminLayoutLogout" onClick={handleLogout} title="Çkyçu">
              {collapsed ? '↩' : '↩ Çkyçu'}
            </button>
          </div>
        </aside>

        <div className="adminLayoutMain">
          <header className="adminLayoutTopbar">
            <GlobalSearch />
          </header>

          <main className="adminLayoutContent">{children}</main>
        </div>
      </div>
    </div>
  );
}