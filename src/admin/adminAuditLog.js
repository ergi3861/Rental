// pages/admin/AdminAuditLogs.jsx
import { useEffect, useState, useCallback } from 'react';
import adminAPI from '../admin/adminAPI';

const fmt = (dt) =>
  dt ? new Date(dt).toLocaleDateString('sq-AL', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

const ACTION_COLORS = {
  car_created:                  { bg: '#34d39922', text: '#34d399' },
  car_updated:                  { bg: '#38bdf822', text: '#38bdf8' },
  car_deleted:                  { bg: '#f8717122', text: '#f87171' },
  reservation_status_changed:   { bg: '#a78bfa22', text: '#a78bfa' },
  UPDATE_USER_ROLE:              { bg: '#fb923c22', text: '#fb923c' },
};

const ENTITY_COLORS = {
  car:         { bg: '#38bdf822', text: '#38bdf8' },
  reservation: { bg: '#a78bfa22', text: '#a78bfa' },
  users:       { bg: '#34d39922', text: '#34d399' },
  sell_request:{ bg: '#fb923c22', text: '#fb923c' },
};

function DiffModal({ log, onClose }) {
  if (!log) return null;
  const diff = log.diff || {};
  const hasDiff = Object.keys(diff).length > 0;

  return (
    <div className="alModal" onClick={(e) => e.target.classList.contains('alModal') && onClose()}>
      <div className="alModalBox">
        <div className="alModalHdr">
          <h3>Veprimi #{log.id} — {log.action}</h3>
          <button className="alModalClose" onClick={onClose}>✕</button>
        </div>
        <div className="alModalBody">
          <div className="alMetaGrid">
            <div className="alMetaItem">
              <div className="alMetaLbl">Veprimi</div>
              <div className="alMetaVal" style={{ color: ACTION_COLORS[log.action]?.text || '#94a3b8' }}>
                {log.action}
              </div>
            </div>
            <div className="alMetaItem">
              <div className="alMetaLbl">Entiteti</div>
              <div className="alMetaVal">{log.entity} #{log.entity_id}</div>
            </div>
            <div className="alMetaItem">
              <div className="alMetaLbl">IP</div>
              <div className="alMetaVal">{log.ip_address || '—'}</div>
            </div>
            <div className="alMetaItem">
              <div className="alMetaLbl">Data</div>
              <div className="alMetaVal" style={{ fontFamily: 'inherit', fontSize: 12 }}>
                {fmt(log.created_at)}
              </div>
            </div>
          </div>

          {hasDiff ? (
            <div className="alDiffSection">
              <h4>Ndryshimet (para → pas)</h4>
              <div className="alDiffHeader">
                <span>Fusha</span><span>Para</span><span>Pas</span>
              </div>
              {Object.entries(diff).map(([field, { from, to }]) => (
                <div key={field} className="alDiffRow">
                  <div className="alDiffField">{field}</div>
                  <div className="alDiffOld">{String(from ?? '—')}</div>
                  <div className="alDiffNew">{String(to ?? '—')}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alDiffSection">
              <p style={{ color: '#475569', fontSize: 13 }}>
                {log.newValue
                  ? <pre style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
                      {JSON.stringify(log.newValue, null, 2)}
                    </pre>
                  : 'Nuk ka të dhëna diff për këtë veprim.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminAuditLogs() {
  const [rows,    setRows]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [action,  setAction]  = useState('');
  const [entity,  setEntity]  = useState('');
  const [from,    setFrom]    = useState('');
  const [to,      setTo]      = useState('');
  const [modal,   setModal]   = useState(null);
  const [stats,   setStats]   = useState({ total: 0, today: 0 });
  const LIMIT = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (action) params.set('action', action);
      if (entity) params.set('entity', entity);
      if (from)   params.set('from', from);
      if (to)     params.set('to', to);

      const res = await adminAPI.get(`/audit-logs?${params}`);
      setRows(res.data.rows  || []);
      setTotal(res.data.total || 0);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, action, entity, from, to]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [action, entity, from, to]);

  // Stats lokale nga rows
  useEffect(() => {
    const today = new Date().toDateString();
    const todayCount = rows.filter(r =>
      new Date(r.created_at).toDateString() === today
    ).length;
    setStats({ total, today: todayCount });
  }, [rows, total]);

  const openDiff = async (id) => {
    try {
      const res = await adminAPI.get(`/audit-logs/${id}`);
      setModal(res.data);
    } catch { /* silent */ }
  };

  const totalPages = Math.ceil(total / LIMIT);

  // Numëro llojet unikale të action dhe entity
  const actionCounts = rows.reduce((acc, r) => {
    acc[r.action] = (acc[r.action] || 0) + 1; return acc;
  }, {});
  const uniqueActions = [...new Set(rows.map(r => r.action))];
  const uniqueEntities = [...new Set(rows.map(r => r.entity))];

  return (
    <div className="alPage">
      <div className="alHeader">
        <div>
          <h1 className="alTitle">Audit Logs</h1>
          <p className="alSub">{total} veprime gjithsej</p>
        </div>
      </div>

      {/* Stats */}
      <div className="alStats">
        <div className="alStat">
          <div className="alStatLbl">Gjithsej</div>
          <div className="alStatVal">{total}</div>
          <div className="alStatSub">të gjitha veprimet</div>
        </div>
        <div className="alStat">
          <div className="alStatLbl">Sot</div>
          <div className="alStatVal" style={{ color: '#38bdf8' }}>{stats.today}</div>
          <div className="alStatSub">veprime sot</div>
        </div>
        <div className="alStat">
          <div className="alStatLbl">Me diff</div>
          <div className="alStatVal" style={{ color: '#a78bfa' }}>
            {rows.filter(r => r.oldValue || r.newValue).length}
          </div>
          <div className="alStatSub">kanë ndryshime</div>
        </div>
        <div className="alStat">
          <div className="alStatLbl">Entitete</div>
          <div className="alStatVal" style={{ color: '#34d399' }}>
            {uniqueEntities.length}
          </div>
          <div className="alStatSub">lloje të ndryshme</div>
        </div>
      </div>

      {/* Filters */}
      <div className="alFilters">
        <select className="alSel" value={action} onChange={e => setAction(e.target.value)}>
          <option value="">Të gjitha veprimet</option>
          {uniqueActions.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select className="alSel" value={entity} onChange={e => setEntity(e.target.value)}>
          <option value="">Të gjitha entitetet</option>
          {uniqueEntities.map(en => (
            <option key={en} value={en}>{en}</option>
          ))}
        </select>
        <input
          className="alInp"
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          title="Nga data"
        />
        <input
          className="alInp"
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          title="Deri data"
        />
        {(action || entity || from || to) && (
          <button
            className="alBtnGhost"
            onClick={() => { setAction(''); setEntity(''); setFrom(''); setTo(''); }}
          >
            ✕ Pastro
          </button>
        )}
      </div>

      {/* Table */}
      <div className="alTableWrap">
        {loading ? (
          <div className="alLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="alEmpty">Nuk ka audit logs.</div>
        ) : (
          <table className="alTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Veprimi</th>
                <th>Entiteti</th>
                <th>ID</th>
                <th>Admin</th>
                <th>IP</th>
                <th>Data</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const ac = ACTION_COLORS[r.action] || { bg: '#1e293b', text: '#94a3b8' };
                const ec = ENTITY_COLORS[r.entity] || { bg: '#1e293b', text: '#64748b' };
                const hasDiff = r.oldValue || r.newValue;
                return (
                  <tr key={r.id}>
                    <td><span className="alId">#{r.id}</span></td>
                    <td>
                      <span className="alBadge" style={{ background: ac.bg, color: ac.text }}>
                        {r.action}
                      </span>
                    </td>
                    <td>
                      <span className="alPill" style={{ background: ec.bg, color: ec.text }}>
                        {r.entity}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontFamily: 'monospace', fontSize: 12 }}>
                      {r.entity_id}
                    </td>
                    <td>
                      <div className="alAdminCell">
                        <span className="alAdminName">
                          {r.first_name} {r.last_name}
                        </span>
                        <span className="alAdminEmail">{r.email}</span>
                      </div>
                    </td>
                    <td style={{ color: '#334155', fontFamily: 'monospace', fontSize: 12 }}>
                      {r.ip_address || '—'}
                    </td>
                    <td><span className="alDate">{fmt(r.created_at)}</span></td>
                    <td>
                      {hasDiff ? (
                        <button className="alDiffBtn" onClick={() => openDiff(r.id)}>
                          Diff
                        </button>
                      ) : (
                        <span style={{ color: '#1e293b', fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="alPagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Diff Modal */}
      {modal && <DiffModal log={modal} onClose={() => setModal(null)} />}
    </div>
  );
}