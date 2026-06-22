import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, PawPrint, CalendarDays, MessageSquare, BookOpen, Briefcase, ScrollText,
  TrendingUp, PieChart, BarChart3,
} from 'lucide-react';
import api from '../../../api/petdate-api';
import { LineChart, DonutChart, BarList } from '../charts/Charts';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Construye la serie de usuarios acumulados por mes a partir de su fechaRegistro.
 * Rellena los meses sin registros para que la curva sea continua.
 */
function buildUserGrowth(usuarios) {
  const counts = {};
  usuarios.forEach((u) => {
    if (!u.fechaRegistro) return;
    const d = new Date(u.fechaRegistro);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const keys = Object.keys(counts).sort();
  if (keys.length === 0) return [];

  const [fy, fm] = keys[0].split('-').map(Number);
  const now = new Date();
  const series = [];
  let cum = 0;
  let y = fy;
  let m = fm;

  while ((y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth() + 1)) && series.length < 24) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    cum += counts[key] || 0;
    series.push({ label: MESES[m - 1], value: cum });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return series;
}

/** Agrupa las citas por estado para el gráfico de dona. */
function buildCitasEstado(citas) {
  const map = { PENDIENTE: 0, COMPLETADO: 0, VENCIDO: 0 };
  citas.forEach((c) => {
    if (map[c.estado] != null) map[c.estado]++;
  });
  return [
    { label: 'Pendiente', value: map.PENDIENTE, color: '#e0a23b' },
    { label: 'Completado', value: map.COMPLETADO, color: '#6aab8e' },
    { label: 'Vencido', value: map.VENCIDO, color: '#e07b54' },
  ];
}

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className="admin-stat-card" style={{ '--card-color': color }}>
    <div className="admin-stat-card__icon">{icon}</div>
    <div className="admin-stat-card__info">
      <span className="admin-stat-card__value">{value ?? '—'}</span>
      <span className="admin-stat-card__label">{label}</span>
    </div>
  </Link>
);

const ChartCard = ({ icon, title, subtitle, wide, children }) => (
  <div className={`admin-chart-card ${wide ? 'admin-chart-card--wide' : ''}`}>
    <div className="admin-chart-card__head">
      <span className="admin-chart-card__icon">{icon}</span>
      <div>
        <h2 className="admin-chart-card__title">{title}</h2>
        {subtitle && <p className="admin-chart-card__sub">{subtitle}</p>}
      </div>
    </div>
    <div className="admin-chart-card__body">{children}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [userGrowth, setUserGrowth] = useState([]);
  const [citasEstado, setCitasEstado] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.usuarios.listar(),
      api.mascotas.listar({ size: 1 }),
      api.citas.listar({ size: 500 }),
      api.comentarios.blog.listar({ size: 1 }),
      api.blogs.listar({ size: 1 }),
      api.servicios.listar({ size: 1 }),
      api.auditoria.listar({ size: 1 }),
    ]).then(([usuarios, mascotas, citas, comentarios, blogs, servicios, logs]) => {
      const usuariosArr = usuarios.status === 'fulfilled' && Array.isArray(usuarios.value) ? usuarios.value : [];
      const citasContent = citas.status === 'fulfilled' ? (citas.value?.content ?? []) : [];

      setStats({
        usuarios:    usuarios.status    === 'fulfilled' ? (Array.isArray(usuarios.value) ? usuarios.value.length : usuarios.value?.totalElements) : '?',
        mascotas:    mascotas.status    === 'fulfilled' ? mascotas.value?.totalElements    : '?',
        citas:       citas.status       === 'fulfilled' ? citas.value?.totalElements       : '?',
        comentarios: comentarios.status === 'fulfilled' ? comentarios.value?.totalElements : '?',
        blogs:       blogs.status       === 'fulfilled' ? blogs.value?.totalElements       : '?',
        servicios:   servicios.status   === 'fulfilled' ? servicios.value?.totalElements   : '?',
        logs:        logs.status        === 'fulfilled' ? logs.value?.totalElements        : '?',
      });
      setUserGrowth(buildUserGrowth(usuariosArr));
      setCitasEstado(buildCitasEstado(citasContent));
      setLoading(false);
    });
  }, []);

  const num = (v) => (typeof v === 'number' ? v : 0);
  const contentBars = [
    { label: 'Usuarios',    value: num(stats.usuarios),    color: '#6b8cbf' },
    { label: 'Mascotas',    value: num(stats.mascotas),    color: '#6aab8e' },
    { label: 'Citas',       value: num(stats.citas),       color: '#e07b54' },
    { label: 'Comentarios', value: num(stats.comentarios), color: '#7e6492' },
    { label: 'Blogs',       value: num(stats.blogs),       color: '#4a90a4' },
    { label: 'Servicios',   value: num(stats.servicios),   color: '#c0a435' },
  ];

  return (
    <div className="admin-section">
      <h1 className="admin-section__title">Dashboard</h1>
      <p className="admin-section__sub">Resumen general de la plataforma</p>

      {loading ? (
        <div className="admin-loading">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="admin-stats-grid">
            <StatCard icon={<Users size={28} />}         label="Usuarios"    value={stats.usuarios}    to="/admin/usuarios"    color="#6b8cbf" />
            <StatCard icon={<PawPrint size={28} />}      label="Mascotas"    value={stats.mascotas}    to="/admin/mascotas"    color="#6aab8e" />
            <StatCard icon={<CalendarDays size={28} />}  label="Citas"       value={stats.citas}       to="/admin/citas"       color="#e07b54" />
            <StatCard icon={<MessageSquare size={28} />} label="Comentarios" value={stats.comentarios} to="/admin/comentarios" color="#7e6492" />
            <StatCard icon={<BookOpen size={28} />}      label="Blogs"       value={stats.blogs}       to="/admin/blogs"       color="#4a90a4" />
            <StatCard icon={<Briefcase size={28} />}     label="Servicios"   value={stats.servicios}   to="/admin/servicios"   color="#c0a435" />
            <StatCard icon={<ScrollText size={28} />}    label="Logs"        value={stats.logs}        to="/admin/logs"        color="#8e6a5e" />
          </div>

          <div className="admin-charts-grid">
            <ChartCard
              wide
              icon={<TrendingUp size={20} />}
              title="Crecimiento de usuarios"
              subtitle="Usuarios registrados acumulados por mes"
            >
              <LineChart data={userGrowth} color="#6b8cbf" />
            </ChartCard>

            <ChartCard
              icon={<PieChart size={20} />}
              title="Citas por estado"
              subtitle="Distribución según su estado actual"
            >
              <DonutChart data={citasEstado} unidad="citas" />
            </ChartCard>

            <ChartCard
              icon={<BarChart3 size={20} />}
              title="Contenido de la plataforma"
              subtitle="Cantidad de registros por tipo"
            >
              <BarList data={contentBars} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
