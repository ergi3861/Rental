import { useEffect, useState, useCallback } from 'react';
import ADMIN_API from '../admin/adminAPI';

const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString('sq-AL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export default function AdminContacts() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: limit });
      const { data } = await ADMIN_API.get(`/contacts?${params}`);
      setRows(data.rows || data || []);
      setTotal(data.total || (data.rows || data).length || 0);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="adminContactsPage">
      <div className="adminContactsHeader">
        <div>
          <h1 className="adminContactsTitle">Kontaktet</h1>
          <p className="adminContactsSub">{total} mesazhe</p>
        </div>
      </div>

      <div className="adminContactsTableWrap">
        {loading ? (
          <div className="adminContactsLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminContactsEmpty">Nuk ka mesazhe.</div>
        ) : (
          <table className="adminContactsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Emri</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Data</th>
                <th>Mesazhi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <>
                  <tr
                    key={c.id}
                    className="adminContactsRow adminContactsRowClickable"
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  >
                    <td>
                      <span className="adminContactsId">#{c.id}</span>
                    </td>
                    <td>
                      <p className="adminContactsName">
                        {c.emri} {c.mbiemri}
                      </p>
                    </td>
                    <td>
                      <span className="adminContactsEmail">{c.email}</span>
                    </td>
                    <td>
                      <span className="adminContactsTelephone">{c.telefoni || '—'}</span>
                    </td>
                    <td>
                      <span className="adminContactsCreated">{fmt(c.created_at)}</span>
                    </td>
                    <td>
                      <span className="adminContactsMsgPreview">
                        {expanded === c.id ? '▲ Mbyll' : '▼ Shfaq mesazhin'}
                      </span>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-exp`} className="adminContactsRowExpanded">
                      <td colSpan={6}>
                        <div className="adminContactsExpandBody">
                          <p className="adminContactsMsgFull">{c.mesazhi}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="adminContactsPagination">
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
