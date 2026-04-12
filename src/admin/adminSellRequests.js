import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const statusMeta = {
  pending: { label: 'Në pritje', color: '#f59e0b' },
  reviewed: { label: 'Shqyrtuar', color: '#38bdf8' },
  offered: { label: 'Ofertë', color: '#a78bfa' },
  accepted: { label: 'Pranuar', color: '#10b981' },
  rejected: { label: 'Refuzuar', color: '#ef4444' },
};

const Base = 'https://rentalbackend.railway.internal/sell-requests/';

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function AdminSellRequests() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [offerInputs, setOfferInputs] = useState({});
  const Limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: Limit });
      if (status) params.set('status', status);
      const { data } = await adminAPI.get(`/sell-requests?${params}`);
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

  const updateStatus = async (id, newStatus, offerPrice) => {
    setUpdating(id);
    try {
      const body = { status: newStatus };
      if (offerPrice) body.admin_offer_price = parseFloat(offerPrice);
      await adminAPI.patch(`/sell-requests/${id}/status`, body);
      setRows((r) =>
        r.map((row) =>
          row.id === id
            ? { ...row, status: newStatus, admin_offer_price: offerPrice || row.admin_offer_price }
            : row
        )
      );
    } catch {
      alert('Gabim gjatë ndryshimit të statusit.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Fshi kërkesën? Ky veprim është i pakthyeshëm.')) return;
    try {
      await adminAPI.delete(`/sell-requests/${id}`);
      setRows((r) => r.filter((row) => row.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Gabim gjatë fshirjes.');
    }
  };

  const totalPages = Math.ceil(total / Limit);

  return (
    <div className="adminSellRequestsPage">
      <div className="adminSellRequestsHeader">
        <div>
          <h1 className="adminSellRequestsTitle">Kërkesat për Shitje</h1>
          <p className="adminSellRequestsTub">{total} gjithsej</p>
        </div>
      </div>

      <div className="adminSellRequestsFilters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Të gjitha statuset</option>
          {Object.entries(statusMeta).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <div className="adminSellRequestsTableWrap">
        {loading ? (
          <div className="adminSellRequestsLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminSellRequestsEmpty">Nuk ka kërkesa.</div>
        ) : (
          <table className="adminSellRequestsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Kontakti</th>
                <th>Makina</th>
                <th>Km · Viti</th>
                <th>Çmimi kërkuar</th>
                <th>Oferta jonë</th>
                <th>Statusi</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const sm = statusMeta[r.status] || { label: r.status, color: '#94a3b8' };
                return (
                  <>
                    <tr
                      key={r.id}
                      className="adminSellRequestsRow adminSellRequestsRowClickable"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    >
                      <td>
                        <span className="adminSellRequestsId">#{r.id}</span>
                      </td>
                      <td>
                        <p className="adminSellRequestsCarName">{r.name}</p>
                        <p className="adminSellRequestsCarMeta">
                          {r.phone} · {r.city}
                        </p>
                      </td>
                      <td>
                        <p className="adminSellRequestsCarName">
                          {r.brand?.charAt(0).toUpperCase() + r.brand?.slice(1)} {r.model}
                        </p>
                        <p className="adminSellRequestsCarMeta">
                          {r.fuel} · {r.transmission}
                        </p>
                      </td>
                      <td>
                        <p className="adminSellRequestsCarMeta">
                          {Number(r.mileage).toLocaleString()} km
                        </p>
                        <p className="adminSellRequestsCarMeta">{r.year}</p>
                      </td>
                      <td>
                        <span className="adminSellRequestsPrice">
                          {r.asking_price ? `€${Number(r.asking_price).toLocaleString()}` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="adminSellRequestsPrice" style={{ color: '#10b981' }}>
                          {r.admin_offer_price
                            ? `€${Number(r.admin_offer_price).toLocaleString()}`
                            : '—'}
                        </span>
                      </td>
                      <td>
                        <span
                          className="adminSellRequestsBadge"
                          style={{ background: sm.color + '22', color: sm.color }}
                        >
                          {sm.label}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="adminSellRequestsActions">
                          <select
                            value={r.status}
                            disabled={updating === r.id}
                            onChange={(e) => updateStatus(r.id, e.target.value, offerInputs[r.id])}
                            className="adminSellRequestsStatusSelect"
                            style={{ borderColor: sm.color }}
                          >
                            {Object.entries(statusMeta).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                          <button
                            className="adminSellRequestsBtnDel"
                            onClick={() => handleDelete(r.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded === r.id && (
                      <tr key={`${r.id}-exp`} className="adminSellRequestsRowExpanded">
                        <td colSpan={8}>
                          <div className="adminSellRequestsExpandBody adminSellRequestsSellDetail">
                            {r.media && r.media.length > 0 && (
                              <div className="adminSellRequestsSellPhotos">
                                {r.media.map((m, i) => (
                                  <img key={i} src={`${Base}${m.image_path}`} alt={`foto-${i}`} />
                                ))}
                              </div>
                            )}
                            <div className="adminSellRequestsSellInfo">
                              <span>
                                <strong>Gjendja:</strong> {r.condition || '—'}
                              </span>
                              <span>
                                <strong>Ngjyra:</strong> {r.color || '—'}
                              </span>
                              <span>
                                <strong>Data:</strong> {fmt(r.created_at)}
                              </span>
                            </div>
                            {/* Ofertë çmimi */}
                            <div
                              className="adminSellRequestsOfferRow"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <label>Vendos ofertë (€):</label>
                              <input
                                type="number"
                                min="0"
                                placeholder="p.sh. 8500"
                                value={offerInputs[r.id] || ''}
                                onChange={(e) =>
                                  setOfferInputs((p) => ({ ...p, [r.id]: e.target.value }))
                                }
                              />
                              <button
                                className="adminSellRequestsBtnOffer"
                                disabled={updating === r.id || !offerInputs[r.id]}
                                onClick={() => updateStatus(r.id, 'offered', offerInputs[r.id])}
                              >
                                {updating === r.id ? '...' : 'Dërgo ofertë'}
                              </button>
                            </div>
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
        <div className="adminSellRequestsPagination">
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
