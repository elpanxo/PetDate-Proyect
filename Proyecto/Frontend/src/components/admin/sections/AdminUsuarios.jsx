import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, ChevronLeft, ChevronRight, RefreshCw, Search, X } from 'lucide-react';
import api from '../../../api/petdate-api';

const AdminUsuarios = () => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [busqueda, setBusqueda] = useState('');

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.usuarios.listar();
      if (Array.isArray(res)) {
        setData({ content: res, totalPages: 1, number: 0 });
      } else {
        setData(res);
      }
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await api.usuarios.eliminar(id);
      load(page);
    } catch {
      alert('No se pudo eliminar el usuario.');
    }
  };

  const filteredContent = data.content.filter((u) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.correo?.toLowerCase().includes(q) ||
      u.telefono?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    );
  });

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Usuarios</h1>
          <p className="admin-section__sub">Todos los usuarios registrados en la plataforma</p>
        </div>
        <div className="admin-section__actions">
          <div className="admin-search">
            <Search size={15} className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por nombre, correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="admin-search__clear" onClick={() => setBusqueda('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <button className="admin-btn admin-btn--ghost" onClick={() => load(page)}>
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
                  <th>ID</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Registro</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={6} className="admin-table__empty">Sin resultados</td></tr>
                ) : filteredContent.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.telefono || '—'}</td>
                    <td>{u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString('es-CL') : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(u.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
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

export const AdminPagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="admin-pagination">
      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onChange(page - 1)} disabled={page === 0}>
        <ChevronLeft size={16} />
      </button>
      <span className="admin-pagination__info">Página {page + 1} de {totalPages}</span>
      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AdminUsuarios;
