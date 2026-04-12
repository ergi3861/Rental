import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../admin/adminAPI';
import '../admin/admin.css';

function StatCard({ label, value, sub, color, icon, to }) {
  const navigate = useNavigate();
  return (
    <div
      className={`adminDashboardStat ${to ? 'adminDashboardStatLink' : ''}`}
      onClick={() => to && navigate(to)}
      style={{ cursor: to ? 'pointer' : 'default' }}
    >
      <div className="adminDashboardStatIcon" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div>
        <p className="adminDashboardStatLabel">{label}</p>
        <p className="adminDashboardStatValue">{value}</p>
        {sub && <p className="adminDashboardStatSub">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="adminDashboardBar">
      <div className="adminDashboardBarInfo">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="adminDashboardBarTrack">
        <div className="adminDashboardBarFill" style={{ width: pct + '%', background: color }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      adminAPI.get('/dashboard/stats'),
      adminAPI.get('/dashboard/chart'),
      adminAPI.get('/dashboard/top-cars'),
      adminAPI.get('/dashboard/activity'),
    ])
      .then(([s, c, t, a]) => {
        setStats(s.data);
        setChart(c.data);
        setTopCars(t.data);
        setActivity(a.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="adminDashboardLoading">Duke ngarkuar...</div>;
  if (error)
    return (
      <div className="adminDashboardLoading" style={{ color: '#ef4444' }}>
        Gabim gjatë ngarkimit të dashboard.
      </div>
    );
  if (!stats) return null;

  const maxChart = Math.max(...chart.map((r) => r.count), 1);

  const fmt = (dt) =>
    new Date(dt).toLocaleDateString('sq-AL', {
      day: '2-digit',
      month: 'short',
    });

  const activityLabel = (item) => {
    if (item.type === 'reservation') return `Rezervim: ${item.brand} ${item.model}`;
    if (item.type === 'sell_request') return `Shitje: ${item.brand} ${item.model}`;
    return `Kontakt nga ${item.name}`;
  };

  const activityColor = (item) => {
    if (item.type === 'reservation') return '#38bdf8';
    if (item.type === 'sell_request') return '#a78bfa';
    return '#34d399';
  };

  const activityPath = (item) => {
    if (item.type === 'reservation') return '/admin/reservations';
    if (item.type === 'sell_request') return '/admin/sell-requests';
    return '/admin/contacts';
  };

  return (
    <div id="adminDashboard">
      <div className="adminDashboardHeader">
        <h1 className="adminDashboardTitle">Dashboard</h1>
        <span className="adminDashboardDate">
          {new Date().toLocaleDateString('sq-AL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>

      <div className="adminDashboardStatsGrid">
        <StatCard
          label="Makinat"
          icon="🚗"
          color="#38bdf8"
          value={stats.cars.total}
          sub={`${stats.cars.available} të lira`}
          to="/admin/cars"
        />
        <StatCard
          label="Rezervimet"
          icon="📋"
          color="#a78bfa"
          value={stats.reservations.total}
          sub={`${stats.reservations.today} sot`}
          to="/admin/reservations"
        />
        <StatCard
          label="Userat"
          icon="👥"
          color="#34d399"
          value={stats.users.total}
          sub={`+${stats.users.today} sot`}
          to="/admin/users"
        />
        <StatCard
          label="Kërkesat shitje"
          icon="🤝"
          color="#fb923c"
          value={stats.sellRequests.total}
          sub={`${stats.sellRequests.new_requests} të reja`}
          to="/admin/sell-requests"
        />
        <StatCard
          label="Të ardhura (muaj)"
          icon="💶"
          color="#f472b6"
          value={`€${Number(stats.revenue.monthly_revenue).toLocaleString()}`}
          sub={`Total: €${Number(stats.revenue.total_revenue).toLocaleString()}`}
        />
        <StatCard
          label="Kontaktet"
          icon="✉️"
          color="#fbbf24"
          value={stats.contacts.total}
          sub="mesazhe"
          to="/admin/contacts"
        />
      </div>

      <div className="adminDashboardRow">
        <div className="adminDashboardCard adminDashboardCardWide">
          <h3>Rezervimet — 30 ditët e fundit</h3>
          <div className="adminDashboardChart">
            {chart.length === 0 ? (
              <p className="adminDashboardEmpty">Nuk ka të dhëna</p>
            ) : (
              chart.map((r, i) => (
                <div key={i} className="adminDashboardChartCol">
                  <div className="adminDashboardChartBarWrap">
                    <div
                      className="adminDashboardChartBar"
                      style={{ height: `${Math.round((r.count / maxChart) * 100)}%` }}
                      title={`${r.count} rezervime — €${r.revenue}`}
                    />
                  </div>
                  <span className="adminDashboardChartLabel">{fmt(r.date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="adminDashboardCard">
          <h3>Gjendja e flotës</h3>
          <div className="adminDashboardFleet">
            {[
              { label: 'Të lira', value: stats.cars.available, color: '#10b981' },
              { label: 'Të rezervuara', value: stats.cars.reserved, color: '#f59e0b' },
              { label: 'Të shitura', value: stats.cars.sold, color: '#ef4444' },
              { label: 'Rental', value: stats.cars.rental, color: '#38bdf8' },
              { label: 'Sale', value: stats.cars.sale, color: '#a78bfa' },
            ].map((item, i) => (
              <MiniBar
                key={i}
                label={item.label}
                value={item.value || 0}
                max={stats.cars.total}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="adminDashboardRow">
        <div className="adminDashboardCard">
          <h3>Makinat më të rezervuara</h3>
          <table className="adminDashboardTable">
            <thead>
              <tr>
                <th>Makina</th>
                <th>Rezervime</th>
                <th>Të ardhura</th>
              </tr>
            </thead>
            <tbody>
              {topCars.map((car, i) => (
                <tr
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/cars/${car.id}/edit`)}
                >
                  <td className="adminDashboardCapitalize">
                    {car.brand} {car.model} ({car.year})
                  </td>
                  <td>{car.reservation_count}</td>
                  <td>€{Number(car.total_revenue).toLocaleString()}</td>
                </tr>
              ))}
              {topCars.length === 0 && (
                <tr>
                  <td colSpan={3} className="adminDashboardEmpty">
                    Nuk ka të dhëna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="adminDashboardCard">
          <h3>Aktiviteti i fundit</h3>
          <div className="adminDashboardActivity">
            {activity.map((item, i) => (
              <div
                key={i}
                className="adminDashboardActivityItem"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(activityPath(item))}
              >
                <div
                  className="adminDashboardActivityDot"
                  style={{ background: activityColor(item) }}
                />
                <div className="adminDashboardActivityBody">
                  <p>{activityLabel(item)}</p>
                  <span>{fmt(item.created_at)}</span>
                </div>
                <span
                  className="adminDashboardActivityStatus"
                  style={{ color: activityColor(item) }}
                >
                  {item.status}
                </span>
              </div>
            ))}
            {activity.length === 0 && <p className="adminDashboardEmpty">Nuk ka aktivitet</p>}
          </div>
        </div>
      </div>

      <div className="adminDashboardRow">
        <div className="adminDashboard-card adminDashboardCardWide">
          <h3>Rezervimet sipas statusit</h3>
          <div className="adminDashboardStatusGrid">
            {[
              { label: 'Në pritje', value: stats.reservations.pending, color: '#f59e0b' },
              { label: 'Konfirmuar', value: stats.reservations.confirmed, color: '#10b981' },
              { label: 'Përfunduar', value: stats.reservations.completed, color: '#6366f1' },
              { label: 'Anuluar', value: stats.reservations.cancelled, color: '#ef4444' },
            ].map((s, i) => (
              <div
                key={i}
                className="adminDashboardStatusBox"
                style={{ borderColor: s.color, cursor: 'pointer' }}
                onClick={() => navigate('/admin/reservations')}
              >
                <span className="adminDashboardStatusBoxVal" style={{ color: s.color }}>
                  {s.value || 0}
                </span>
                <span className="adminDashboardStatusBoxLbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
