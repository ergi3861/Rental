import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

export default function AdminSearchLogs() {
  const [rows,        setRows]        = useState([]);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState('');
  const [topSearches, setTopSearches] = useState([]);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('q', search);

      const [logsRes, topRes] = await Promise.all([
        adminAPI.get(`/search-logs?${params}`),
        adminAPI.get('/search-logs/top'),
      ]);

      setRows(logsRes.data.rows   || []);
      setTotal(logsRes.data.total || 0);
      setTopSearches(topRes.data  || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="adminSearchLogsPage">
      <div className="adminSearchLogsHeader">
        <div>
          <h1 className="adminSearchLogsTitle">Kërkesat e Kërkimit</h1>
          <p className="adminSearchLogsSub">{total} gjithsej</p>
        </div>
      </div>

      {/* ── Top Searches ── */}
      {topSearches.length > 0 && (
        <div className="adminSearchLogsTop">
          <h3>🔥 Kërkimet më të shpeshta</h3>
          <div className="adminSearchLogsTopGrid">
            {topSearches.map((t, i) => (
              <div key={i} className="adminSearchLogsTopItem">
                <span className="adminSearchLogsTopRank">#{i + 1}</span>
                <span className="adminSearchLogsTopQuery">{t.query}</span>
                <span className="adminSearchLogsTopCount">{t.count}x</span>
                <span className="adminSearchLogsTopAvg">
                  ~{Math.round(t.avg_results)} rezultate
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter ── */}
      <div className="adminSearchLogsFilters">
        <input
          className="adminSearchLogsSearch"
          placeholder="Kërko në logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className="adminSearchLogsTableWrap">
        {loading ? (
          <div className="adminSearchLogsLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminSearchLogsEmpty">Nuk ka logs.</div>
        ) : (
          <table className="adminSearchLogsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Kërkimi</th>
                <th>Tipi</th>
                <th>Makina e klikuar</th>
                <th>Useri</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><span className="adminSearchLogsId">#{r.id}</span></td>
                  <td><span className="adminSearchLogsQuery">{r.query}</span></td>
                  <td>
                    <span
                      className="adminSearchLogsBadge"
                      style={{
                        color:
                          r.search_type === 'car_click' ? '#10b981' :
                          r.search_type === 'view_all'  ? '#f59e0b' : '#94a3b8',
                        background:
                          r.search_type === 'car_click' ? '#10b98122' :
                          r.search_type === 'view_all'  ? '#f59e0b22' : '#94a3b822',
                      }}
                    >
                      {r.search_type === 'car_click' ? '🚗 Klikim' :
                       r.search_type === 'view_all'  ? '👁 Të gjitha' : '⌨️ Shkrim'}
                    </span>
                  </td>
                  <td>
                    <span className="adminSearchLogsCarName">
                      {r.car_name || '—'}
                    </span>
                  </td>
                  <td>
                    {r.first_name ? (
                      <span className="adminSearchLogsUser">
                        {r.first_name} {r.last_name}
                        <small>{r.email}</small>
                      </span>
                    ) : (
                      <span className="adminSearchLogsGuest">Guest</span>
                    )}
                  </td>
                  <td><span className="adminSearchLogsDate">{fmt(r.created_at)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="adminSearchLogsPagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹ Prapa
          </button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Para ›
          </button>
        </div>
      )}
    </div>
  );
}