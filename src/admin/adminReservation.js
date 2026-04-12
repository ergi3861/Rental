import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const statusMeta = {
  pending: { label: 'Në pritje', color: '#f59e0b' },
  confirmed: { label: 'Konfirmuar', color: '#10b981' },
  completed: { label: 'Përfunduar', color: '#6366f1' },
  cancelled: { label: 'Anuluar', color: '#ef4444' },
};

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function AdminReservations() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (status) params.set('status', status);
      const { data } = await adminAPI.get(`/reservations?${params}`);
      setRows(data.rows || data || []);
      setTotal(data.total || (data.rows || data).length || 0);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [status]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await adminAPI.patch(`/reservations/${id}/status`, { status: newStatus });
      setRows((r) => r.map((row) => (row.id === id ? { ...row, status: newStatus } : row)));
    } catch {
      alert('Gabim gjatë ndryshimit të statusit.');
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div id="adminReservationPage">
      <div className="adminReservationHeader">
        <div>
          <h1 className="adminReservationTitle">Rezervimet</h1>
          <p className="adminReservationSub">{total} gjithsej</p>
        </div>
      </div>

      <div className="adminReservationFilters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Të gjitha statuset</option>
          {Object.entries(statusMeta).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <div className="adminReservationTableWrap">
        {loading ? (
          <div className="adminReservationLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminReservationEmpty">Nuk ka rezervime.</div>
        ) : (
          <table className="adminReservationTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Klienti</th>
                <th>Makina</th>
                <th>Periudha</th>
                <th>Vlera</th>
                <th>Statusi</th>
                <th>Ndrysho status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const sm = statusMeta[r.status] || { label: r.status, color: '#94a3b8' };
                return (
                  <>
                    <tr
                      key={r.id}
                      className="adminReservationRow adminReservationRowClickable"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    >
                      <td>
                        <span className="adminReservationId">#{r.id}</span>
                      </td>
                      <td>
                        <p className="adminReservationCarName">
                          {r.first_name} {r.last_name}
                        </p>
                        <p className="adminReservationCarMeta">{r.email}</p>
                      </td>
                      <td>
                        <p className="adminReservationCarName">
                          {r.brand} {r.model}
                        </p>
                        <p className="adminReservationCarMeta">{r.year}</p>
                      </td>
                      <td>
                        <p className="adminReservationCarMeta">{fmt(r.start_datetime)}</p>
                        <p className="adminReservationCarMeta">→ {fmt(r.end_datetime)}</p>
                      </td>
                      <td>
                        <span className="adminReservationPrice">
                          €{Number(r.total_price || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className="adminReservationBadge"
                          style={{ background: sm.color + '22', color: sm.color }}
                        >
                          {sm.label}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          value={r.status}
                          disabled={updating === r.id}
                          onChange={(e) => updateStatus(r.id, e.target.value)}
                          className="adminReservationStatusSelect"
                          style={{ borderColor: sm.color }}
                        >
                          {Object.entries(statusMeta).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr key={`${r.id}-exp`} className="adminReservationRowExpanded">
                        <td colSpan={7}>
                          <div className="adminReservationExpandBody">
                            <span>
                              <strong>Telefon:</strong> {r.phone || '—'}
                            </span>
                            <span>
                              <strong>Krijuar:</strong> {fmt(r.created_at)}
                            </span>
                            <span>
                              <strong>Shënime:</strong> {r.notes || '—'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="adminReservationPagination">
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
