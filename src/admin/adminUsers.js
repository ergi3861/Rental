import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const roleMeta = {
  user:       { label: 'Përdorues', color: '#38bdf8' },
  admin:      { label: 'Admin',     color: '#a78bfa' },
  superadmin: { label: 'Super',     color: '#f472b6' },
};

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

function UserModal({ userId, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminAPI.get(`/users/${userId}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="ud-modal-overlay" onClick={onClose}>
      <div className="ud-modal" onClick={e => e.stopPropagation()}>
        <button className="ud-modal__close" onClick={onClose}>✕</button>

        {loading ? (
          <div className="adminUsersLoading">Duke ngarkuar...</div>
        ) : !data ? (
          <p>Gabim gjatë ngarkimit.</p>
        ) : (
          <>
            {/* Header */}
            <div className="ud-modal__header">
              <div className="ud-modal__avatar">
                {data.user?.profile_photo ? (
                  <img
                    src={data.user.profile_photo}
                    alt="profil"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <>{data.user?.first_name?.[0]}{data.user?.last_name?.[0]}</>
                )}
              </div>
              <div>
                <h2>{data.user?.first_name} {data.user?.last_name}</h2>
                <p>{data.user?.email}</p>
                <span
                  className="adminUsersBadge"
                  style={{
                    background: (roleMeta[data.user?.role]?.color || '#94a3b8') + '22',
                    color: roleMeta[data.user?.role]?.color || '#94a3b8',
                  }}
                >
                  {roleMeta[data.user?.role]?.label || data.user?.role}
                </span>
              </div>
            </div>

            <div className="ud-modal__section">
              <h3>📋 Të dhënat personale</h3>
              <div className="ud-modal__grid">
                {[
                  { label: 'Telefon',        val: data.user?.phone },
                  { label: 'Qyteti',         val: data.user?.city },
                  { label: 'Shteti',         val: data.user?.country },
                  { label: 'Adresa',         val: data.user?.address },
                  { label: 'Mosha',          val: data.user?.age ? `${data.user.age} vjeç` : null },
                  { label: 'Gjinia',         val: data.user?.gender },
                  { label: 'ID / Pasaportë', val: data.user?.id_number },
                  { label: 'Nr. patentës',   val: data.user?.license_number },
                  { label: 'Patenta skadon', val: fmt(data.user?.license_expiry) },
                  { label: 'Regjistruar',    val: fmt(data.user?.created_at) },
                  { label: 'Profil',         val: `${data.user?.completion_percent || 0}%` },
                ].map((item, i) => (
                  <div key={i} className="ud-modal__info-row">
                    <span className="ud-modal__info-label">{item.label}</span>
                    <span className="ud-modal__info-val">{item.val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {data.user?.profile_photo && (
              <div className="ud-modal__section">
                <h3>📷 Foto e profilit</h3>
                <img
                  src={data.user.profile_photo}
                  alt="profil"
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginTop: 8 }}
                />
              </div>
            )}

            {data.user?.license_photo && (
              <div className="ud-modal__section">
                <h3>🪪 Foto e patentës</h3>
                <img
                  src={data.user.license_photo}
                  alt="patenta"
                  style={{ width: '100%', maxWidth: 300, borderRadius: 8, marginTop: 8 }}
                />
              </div>
            )}

            <div className="ud-modal__section">
              <h3>📋 Rezervimet ({data.reservations?.length || 0})</h3>
              {data.reservations?.length === 0 ? (
                <p className="ud-modal__empty">Nuk ka rezervime.</p>
              ) : (
                <div className="ud-modal__table-wrap">
                  <table className="ud-modal__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Makina</th>
                        <th>Periudha</th>
                        <th>Çmimi</th>
                        <th>Statusi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reservations.map(r => (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{r.brand} {r.model} ({r.year})</td>
                          <td>{fmt(r.start_datetime)} → {fmt(r.end_datetime)}</td>
                          <td>€{Number(r.total_price || 0).toLocaleString()}</td>
                          <td>
                            <span className="adminUsersBadge" style={{ background: '#f59e0b22', color: '#f59e0b' }}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="ud-modal__section">
              <h3>🤝 Kërkesat shitje ({data.sellRequests?.length || 0})</h3>
              {data.sellRequests?.length === 0 ? (
                <p className="ud-modal__empty">Nuk ka kërkesa.</p>
              ) : (
                <div className="ud-modal__table-wrap">
                  <table className="ud-modal__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Makina</th>
                        <th>Çmimi kërkuar</th>
                        <th>Oferta</th>
                        <th>Statusi</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sellRequests.map(s => (
                        <tr key={s.id}>
                          <td>#{s.id}</td>
                          <td>{s.brand} {s.model} ({s.year})</td>
                          <td>{s.asking_price ? `€${Number(s.asking_price).toLocaleString()}` : '—'}</td>
                          <td>{s.admin_offer_price ? `€${Number(s.admin_offer_price).toLocaleString()}` : '—'}</td>
                          <td>
                            <span className="adminUsersBadge" style={{ background: '#a78bfa22', color: '#a78bfa' }}>
                              {s.status}
                            </span>
                          </td>
                          <td>{fmt(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [rows, setRows]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('search', search);
      const { data } = await adminAPI.get(`/users?${params}`);
      setRows(data.rows || data || []);
      setTotal(data.total || (data.rows || data).length || 0);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const updateRole = async (id, role) => {
    setUpdating(id);
    try {
      await adminAPI.patch(`/users/${id}/role`, { role });
      setRows(r => r.map(u => u.id === id ? { ...u, role } : u));
    } catch {
      alert('Gabim gjatë ndryshimit të rolit.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Fshi "${name}"? Ky veprim është i pakthyeshëm.`)) return;
    setDeleting(id);
    try {
      await adminAPI.delete(`/users/${id}`);
      setRows(r => r.filter(u => u.id !== id));
      setTotal(t => t - 1);
    } catch {
      alert('Gabim gjatë fshirjes.');
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="adminUsersPage">
      <UserModal userId={selectedId} onClose={() => setSelectedId(null)} />

      <div className="adminUsersHeader">
        <div>
          <h1 className="adminUsersTitle">Përdoruesit</h1>
          <p className="adminUserSub">{total} gjithsej</p>
        </div>
      </div>

      <div className="adminUsersFilters">
        <input
          className="adminUsersSearch"
          placeholder="Kërko emër, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="adminUsersTableWrap">
        {loading ? (
          <div className="adminUsersLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminUserEmpty">Nuk ka përdorues.</div>
        ) : (
          <table className="adminUsersTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Emri</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Roli</th>
                <th>Regjistruar</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(u => {
                const rm = roleMeta[u.role] || { label: u.role, color: '#94a3b8' };
                return (
                  <tr
                    key={u.id}
                    className="adminUsersRow"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedId(u.id)}
                  >
                    <td><span className="adminUsersId">#{u.id}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {u.profile_photo ? (
                          <img
                            src={u.profile_photo}
                            alt="profil"
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                        )}
                        <p className="adminUsersCarName">{u.first_name} {u.last_name}</p>
                      </div>
                    </td>
                    <td><span className="adminUsersVin">{u.email}</span></td>
                    <td><span className="adminUsersCarMeta">{u.phone || '—'}</span></td>
                    <td>
                      <span className="adminUsersBadge" style={{ background: rm.color + '22', color: rm.color }}>
                        {rm.label}
                      </span>
                    </td>
                    <td><span className="adminUsersCarMeta">{fmt(u.created_at)}</span></td>
                    <td>
                      <div className="adminUsersActions" onClick={e => e.stopPropagation()}>
                        <select
                          value={u.role}
                          disabled={updating === u.id}
                          onChange={e => updateRole(u.id, e.target.value)}
                          className="adminUsersStatusSelect"
                          style={{ borderColor: rm.color }}
                        >
                          <option value="user">Përdorues</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super</option>
                        </select>
                        <button
                          className="adminUsersBtnDel"
                          disabled={deleting === u.id}
                          onClick={() => handleDelete(u.id, `${u.first_name} ${u.last_name}`)}
                        >
                          {deleting === u.id ? '...' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="adminUsersPagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prapa</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Para ›</button>
        </div>
      )}
    </div>
  );
}