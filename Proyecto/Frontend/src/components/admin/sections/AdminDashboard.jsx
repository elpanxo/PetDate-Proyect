import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PawPrint, CalendarDays, MessageSquare, BookOpen, Briefcase, ScrollText } from 'lucide-react';
import api from '../../../api/petdate-api';

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className="admin-stat-card" style={{ '--card-color': color }}>
    <div className="admin-stat-card__icon">{icon}</div>
    <div className="admin-stat-card__info">
      <span className="admin-stat-card__value">{value ?? '—'}</span>
      <span className="admin-stat-card__label">{label}</span>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.usuarios.listar(),
      api.mascotas.listar({ size: 1 }),
      api.citas.listar({ size: 1 }),
      api.comentarios.blog.listar({ size: 1 }),
      api.blogs.listar({ size: 1 }),
      api.servicios.listar({ size: 1 }),
      api.auditoria.listar({ size: 1 }),
    ]).then(([usuarios, mascotas, citas, comentarios, blogs, servicios, logs]) => {
      setStats({
        usuarios:    usuarios.status    === 'fulfilled' ? (Array.isArray(usuarios.value) ? usuarios.value.length : usuarios.value?.totalElements) : '?',
        mascotas:    mascotas.status    === 'fulfilled' ? mascotas.value?.totalElements    : '?',
        citas:       citas.status       === 'fulfilled' ? citas.value?.totalElements       : '?',
        comentarios: comentarios.status === 'fulfilled' ? comentarios.value?.totalElements : '?',
        blogs:       blogs.status       === 'fulfilled' ? blogs.value?.totalElements       : '?',
        servicios:   servicios.status   === 'fulfilled' ? servicios.value?.totalElements   : '?',
        logs:        logs.status        === 'fulfilled' ? logs.value?.totalElements        : '?',
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="admin-section">
      <h1 className="admin-section__title">Dashboard</h1>
      <p className="admin-section__sub">Resumen general de la plataforma</p>

      {loading ? (
        <div className="admin-loading">Cargando estadísticas...</div>
      ) : (
        <div className="admin-stats-grid">
          <StatCard icon={<Users size={28} />}         label="Usuarios"    value={stats.usuarios}    to="/admin/usuarios"    color="#6b8cbf" />
          <StatCard icon={<PawPrint size={28} />}      label="Mascotas"    value={stats.mascotas}    to="/admin/mascotas"    color="#6aab8e" />
          <StatCard icon={<CalendarDays size={28} />}  label="Citas"       value={stats.citas}       to="/admin/citas"       color="#e07b54" />
          <StatCard icon={<MessageSquare size={28} />} label="Comentarios" value={stats.comentarios} to="/admin/comentarios" color="#7e6492" />
          <StatCard icon={<BookOpen size={28} />}      label="Blogs"       value={stats.blogs}       to="/admin/blogs"       color="#4a90a4" />
          <StatCard icon={<Briefcase size={28} />}     label="Servicios"   value={stats.servicios}   to="/admin/servicios"   color="#c0a435" />
          <StatCard icon={<ScrollText size={28} />}    label="Logs"        value={stats.logs}        to="/admin/logs"        color="#8e6a5e" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
