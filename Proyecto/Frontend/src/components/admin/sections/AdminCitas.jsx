import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, RefreshCw, Search, X } from 'lucide-react';
import api from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const ESTADO_BADGE = {
  PENDIENTE:  { label: 'Pendiente',  color: '#e07b54' },
  COMPLETADO: { label: 'Completado', color: '#6aab8e' },
  VENCIDO:    { label: 'Vencido',    color: '#999'    },
};

const AdminCitas = () => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda]         = useState('');

  const load = useCallback(async (p = 0, estado = '') => {
    setLoading(true);
    setError('');
    try {
      const res = estado
        ? await api.citas.porEstado(estado, { page: p, size: 20 })
        : await api.citas.listar({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar las citas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, filtroEstado); }, [load, page, filtroEstado]);

  const cambiarEstado = async (id, estado) => {
    try {
      await api.citas.cambiarEstado(id, estado);
      load(page, filtroEstado);
    } catch {
      alert('No se pudo cambiar el estado.');
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await api.citas.eliminar(id);
      load(page, filtroEstado);
    } catch {
      alert('No se pudo eliminar la cita.');
    }
  };

  const filteredContent = data.content.filter((c) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      String(c.idUsuario).includes(q) ||
      String(c.idMascota).includes(q) ||
      c.tipoEvento?.toLowerCase().includes(q) ||
      c.fecha?.includes(q)
    );
  });

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Citas</h1>
          <p className="admin-section__sub">Todas las citas médicas de la plataforma</p>
        </div>
        <div className="admin-section__actions">
          <div className="admin-search">
            <Search size={15} className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por usuario, tipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="admin-search__clear" onClick={() => setBusqueda('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <select
            className="admin-select"
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPage(0); }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="COMPLETADO">Completado</option>
            <option value="VENCIDO">Vencido</option>
          </select>
          <button className="admin-btn admin-btn--ghost" onClick={() => load(page, filtroEstado)}>
            <RefreshCw size={16} /> Actualizar
          </button>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Usuario</th><th>Mascota</th><th>Tipo</th>
                  <th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={8} className="admin-table__empty">Sin resultados</td></tr>
                ) : filteredContent.map((c) => {
                  const badge = ESTADO_BADGE[c.estado] || { label: c.estado, color: '#999' };
                  return (
                    <tr key={c.idEvento}>
                      <td>{c.idEvento}</td>
                      <td>{c.idUsuario}</td>
                      <td>{c.idMascota}</td>
                      <td>{c.tipoEvento}</td>
                      <td>{c.fecha}</td>
                      <td>{c.hora}</td>
                      <td>
                        <span className="admin-badge" style={{ background: badge.color }}>{badge.label}</span>
                      </td>
                      <td className="admin-table__actions">
                        <select
                          className="admin-select admin-select--sm"
                          value={c.estado}
                          onChange={(e) => cambiarEstado(c.idEvento, e.target.value)}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="COMPLETADO">Completado</option>
                          <option value="VENCIDO">Vencido</option>
                        </select>
                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(c.idEvento)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!busqueda && <AdminPagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
          {busqueda && filteredContent.length > 0 && (
            <p className="admin-pagination__info" style={{ textAlign: 'center', marginTop: 12 }}>
              {filteredContent.length} resultado{filteredContent.length !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCitas;
