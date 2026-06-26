import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, CalendarDays, MessageSquare,
  BookOpen, Briefcase, ScrollText, Users, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react';
import api from '../../api/petdate-api';
import './Admin.css';

const NAV_ITEMS = [
  { to: '/admin',             icon: <LayoutDashboard size={18} />, label: 'Dashboard',    end: true },
  { to: '/admin/usuarios',    icon: <Users size={18} />,           label: 'Usuarios'              },
  { to: '/admin/mascotas',    icon: <PawPrint size={18} />,        label: 'Mascotas'              },
  { to: '/admin/citas',       icon: <CalendarDays size={18} />,    label: 'Citas'                 },
  { to: '/admin/comentarios', icon: <MessageSquare size={18} />,   label: 'Comentarios'           },
  { to: '/admin/blogs',       icon: <BookOpen size={18} />,        label: 'Blog'                  },
  { to: '/admin/servicios',   icon: <Briefcase size={18} />,       label: 'Servicios'             },
  { to: '/admin/logs',        icon: <ScrollText size={18} />,      label: 'Logs'                  },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const navigate = useNavigate();

  const handleLogout = () => {
    api.auth.logout();
    navigate('/admin/login');
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Overlay para cerrar sidebar en mobile al tocar fuera */}
      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <ShieldCheck size={22} className="admin-sidebar__logo-icon" />
          {sidebarOpen && <span className="admin-sidebar__logo-text">PetDate Admin</span>}
          <button className="admin-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
              }
              onClick={closeSidebarOnMobile}
            >
              <span className="admin-nav-item__icon">{icon}</span>
              {sidebarOpen && <span className="admin-nav-item__label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} />
          {sidebarOpen && <span>Cerrar sesión</span>}
        </button>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="admin-main">
        {/* Topbar visible solo en mobile */}
        <header className="admin-mobile-topbar">
          <button
            className="admin-sidebar__toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <span className="admin-mobile-topbar__brand">PetDate Admin</span>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
