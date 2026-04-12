import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const roleMeta = {
  user: { label: 'Përdorues', color: '#38bdf8' },
  admin: { label: 'Admin', color: '#a78bfa' },
  superadmin: { label: 'Super', color: '#f472b6' },
};

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
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

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  const updateRole = async (id, role) => {
    setUpdating(id);
    try {
      await adminAPI.patch(`/users/${id}/role`, { role });
      setRows((r) => r.map((u) => (u.id === id ? { ...u, role } : u)));
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
      setRows((r) => r.filter((u) => u.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Gabim gjatë fshirjes.');
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="adminUsersPage">
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
          onChange={(e) => setSearch(e.target.value)}
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
              {rows.map((u) => {
                const rm = roleMeta[u.role] || { label: u.role, color: '#94a3b8' };
                return (
                  <tr key={u.id} className="adminUsersRow">
                    <td>
                      <span className="adminUsersId">#{u.id}</span>
                    </td>
                    <td>
                      <p className="adminUsersCarName">
                        {u.first_name} {u.last_name}
                      </p>
                    </td>
                    <td>
                      <span className="adminUsersVin">{u.email}</span>
                    </td>
                    <td>
                      <span className="adminUsersCarMeta">{u.phone || '—'}</span>
                    </td>
                    <td>
                      <span
                        className="adminUsersBadge"
                        style={{ background: rm.color + '22', color: rm.color }}
                      >
                        {rm.label}
                      </span>
                    </td>
                    <td>
                      <span className="adminUsersCarMeta">{fmt(u.created_at)}</span>
                    </td>
                    <td>
                      <div className="adminUsersActions">
                        <select
                          value={u.role}
                          disabled={updating === u.id}
                          onChange={(e) => updateRole(u.id, e.target.value)}
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
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹ Prapa
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Para ›
          </button>
        </div>
      )}
    </div>
  );
}
