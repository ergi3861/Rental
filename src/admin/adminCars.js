import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ADMIN_API from '../admin/adminAPI';

const base = 'http://localhost:5000/uploads/';

const statusMeta = {
  available: { label: 'Lirë', color: '#10b981' },
  reserved: { label: 'Rezervuar', color: '#f59e0b' },
  sold: { label: 'Shitur', color: '#ef4444' },
  service: { label: 'Servis', color: '#6366f1' },
  pending: { label: 'Në pritje', color: '#94a3b8' },
};

const typeMeta = {
  RENTAL: { label: 'Qira', color: '#38bdf8' },
  SALE: { label: 'Shitje', color: '#a78bfa' },
};

export default function AdminCarsList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [brand, setBrand] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: limit });
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      if (status) params.set('status', status);
      if (brand) params.set('brand', brand);

      const { data } = await ADMIN_API.get(`/cars?${params}`);
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, type, status, brand]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, type, status, brand]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Fshi "${name}"? Ky veprim është i pakthyeshëm.`)) return;
    setDeleting(id);
    try {
      await ADMIN_API.delete(`/cars/${id}`);
      setRows((r) => r.filter((c) => c.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Gabim gjatë fshirjes.');
    } finally {
      setDeleting(null);
    }
  };

  const thumb = (car) => {
    const img = car.media?.[0];
    if (!img) return null;
    const src = img.image_path.includes('/')
      ? `${base}${img.image_path}`
      : `${base}${img.image_path}`;
    return src;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="adminCarsPage">
      <div className="adminCarsHeader">
        <div>
          <h1 className="adminCarsTitle">Makinat</h1>
          <p className="adminCarsSub">{total} gjithsej</p>
        </div>
        <button className="adminCarsBtnAdd" onClick={() => navigate('/admin/cars/add')}>
          + Shto Makinë
        </button>
      </div>

      <div className="adminCarsFilters">
        <input
          className="adminCarsSearch"
          placeholder="Kërko markë, model, VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Të gjitha llojet</option>
          <option value="RENTAL">Qira</option>
          <option value="SALE">Shitje</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Të gjitha statuset</option>
          <option value="available">Lirë</option>
          <option value="reserved">Rezervuar</option>
          <option value="sold">Shitur</option>
          <option value="service">Servis</option>
        </select>
      </div>

      <div className="adminCarsTableWrap">
        {loading ? (
          <div className="adminCarsLoading">Duke ngarkuar...</div>
        ) : rows.length === 0 ? (
          <div className="adminCarsEmpty">Nuk u gjetën makina.</div>
        ) : (
          <table className="adminCarsTable">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Makina</th>
                <th>VIN</th>
                <th>Lloji</th>
                <th>Çmimi</th>
                <th>Statusi</th>
                <th>Rezervime</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((car) => {
                const src = thumb(car);
                const sm = statusMeta[car.status] || { label: car.status, color: '#94a3b8' };
                const tm = typeMeta[car.type] || { label: car.type, color: '#94a3b8' };
                const price =
                  car.type === 'RENTAL'
                    ? `€${Number(car.price_per_day).toLocaleString()}/ditë`
                    : `€${Number(car.sale_price).toLocaleString()}`;

                return (
                  <tr key={car.id} className="adminCarsRow">
                    <td>
                      {src ? (
                        <img className="adminCarsThumb" src={src} alt={car.model} />
                      ) : (
                        <div className="adminCarsThumb adminCarsNoImg">🚗</div>
                      )}
                    </td>
                    <td>
                      <p className="adminCarsCarName">
                        {car.brand.charAt(0).toUpperCase() + car.brand.slice(1)} {car.model}
                      </p>
                      <p className="adminCarsCarMeta">
                        {car.year} · {car.fuel} · {car.transmission}
                      </p>
                    </td>
                    <td>
                      <span className="adminCarsVin">{car.vin}</span>
                    </td>
                    <td>
                      <span
                        className="adminCarsBadge"
                        style={{ background: tm.color + '22', color: tm.color }}
                      >
                        {tm.label}
                      </span>
                    </td>
                    <td>
                      <span className="adminCarsPrice">{price}</span>
                    </td>
                    <td>
                      <span
                        className="adminCarsBadge"
                        style={{ background: sm.color + '22', color: sm.color }}
                      >
                        {sm.label}
                      </span>
                    </td>
                    <td>
                      <span className="adminCarsCount">{car.reservation_count || 0}</span>
                    </td>
                    <td>
                      <div className="adminCarsActions">
                        <button
                          className="adminCarsBtnEdit"
                          onClick={() => navigate(`/admin/cars/${car.id}/edit`)}
                        >
                          ✏️
                        </button>
                        <button
                          className="adminCarsBtnDel"
                          disabled={deleting === car.id}
                          onClick={() => handleDelete(car.id, `${car.brand} ${car.model}`)}
                        >
                          {deleting === car.id ? '...' : '🗑️'}
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
        <div className="adminCarsPagination">
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
