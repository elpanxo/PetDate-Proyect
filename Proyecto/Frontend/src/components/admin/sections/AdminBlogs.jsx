import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, RefreshCw, Search, X } from 'lucide-react';
import api, { BASE_URL } from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const AdminBlogs = () => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [busqueda, setBusqueda] = useState('');

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.blogs.listar({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar los blogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta entrada de blog?')) return;
    try {
      await api.blogs.eliminar(id);
      load(page);
    } catch {
      alert('No se pudo eliminar el blog.');
    }
  };

  const filteredContent = data.content.filter((b) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      b.titulo?.toLowerCase().includes(q) ||
      String(b.idServicio).includes(q) ||
      String(b.idBlog).includes(q)
    );
  });

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Blog</h1>
          <p className="admin-section__sub">Todas las entradas de blog de la plataforma</p>
        </div>
        <div className="admin-section__actions">
          <div className="admin-search">
            <Search size={15} className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por título..."
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
                  <th>ID</th><th>Imagen</th><th>Título</th><th>Servicio ID</th>
                  <th>Fecha</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={6} className="admin-table__empty">Sin resultados</td></tr>
                ) : filteredContent.map((b) => (
                  <tr key={b.idBlog}>
                    <td>{b.idBlog}</td>
                    <td>
                      {b.imagen
                        ? <img src={`${BASE_URL}${b.imagen}`} alt="" className="admin-table__thumb" />
                        : <span className="admin-table__no-img">—</span>
                      }
                    </td>
                    <td className="admin-table__text-cell">{b.titulo}</td>
                    <td>{b.idServicio}</td>
                    <td>{b.fecha ? new Date(b.fecha).toLocaleDateString('es-CL') : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(b.idBlog)}>
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

export default AdminBlogs;
