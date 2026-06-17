import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, RefreshCw, Search, X } from 'lucide-react';
import api from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const Estrellas = ({ n }) => '★'.repeat(n) + '☆'.repeat(5 - n);

const TablaComentarios = ({ tipo, fetchFn }) => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [busqueda, setBusqueda]       = useState('');
  const [filtroEstrellas, setFiltroEstrellas] = useState('');

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFn({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar los comentarios.');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { load(page); }, [load, page]);

  const eliminarFn = tipo === 'blog'
    ? (id) => api.comentarios.blog.eliminar(id)
    : (id) => api.comentarios.servicio.eliminar(id);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    try {
      await eliminarFn(id);
      load(page);
    } catch {
      alert('No se pudo eliminar el comentario.');
    }
  };

  const filteredContent = data.content.filter((c) => {
    const matchEstrellas = !filtroEstrellas || c.calificacion === Number(filtroEstrellas);
    const matchBusqueda = !busqueda || (() => {
      const q = busqueda.toLowerCase();
      return (
        c.nombreUsuario?.toLowerCase().includes(q) ||
        c.texto?.toLowerCase().includes(q)
      );
    })();
    return matchEstrellas && matchBusqueda;
  });

  return (
    <>
      <div className="admin-section__actions" style={{ marginBottom: 16 }}>
        <div className="admin-search">
          <Search size={15} className="admin-search__icon" />
          <input
            className="admin-search__input"
            type="text"
            placeholder="Buscar por usuario, texto..."
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
          value={filtroEstrellas}
          onChange={(e) => setFiltroEstrellas(e.target.value)}
        >
          <option value="">Todas las calificaciones</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>
        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => load(page)}>
          <RefreshCw size={15} /> Actualizar
        </button>
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
                  <th>ID</th>
                  <th>{tipo === 'blog' ? 'Blog ID' : 'Servicio ID'}</th>
                  <th>Usuario</th><th>Texto</th><th>Calif.</th><th>Fecha</th><th>Acc.</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={7} className="admin-table__empty">Sin comentarios</td></tr>
                ) : filteredContent.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.idBlog ?? c.idServicio}</td>
                    <td>{c.nombreUsuario}</td>
                    <td className="admin-table__text-cell">{c.texto}</td>
                    <td><span className="admin-stars">{Estrellas(c.calificacion)}</span></td>
                    <td>{c.fecha ? new Date(c.fecha).toLocaleDateString('es-CL') : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!busqueda && !filtroEstrellas && (
            <AdminPagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          )}
          {(busqueda || filtroEstrellas) && filteredContent.length > 0 && (
            <p className="admin-pagination__info" style={{ textAlign: 'center', marginTop: 12 }}>
              {filteredContent.length} resultado{filteredContent.length !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </>
  );
};

const AdminComentarios = () => {
  const [tab, setTab] = useState('blog');

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Comentarios</h1>
          <p className="admin-section__sub">Comentarios de blogs y servicios</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'blog' ? 'admin-tab--active' : ''}`} onClick={() => setTab('blog')}>
          Comentarios de Blog
        </button>
        <button className={`admin-tab ${tab === 'servicio' ? 'admin-tab--active' : ''}`} onClick={() => setTab('servicio')}>
          Comentarios de Servicio
        </button>
      </div>

      {tab === 'blog' ? (
        <TablaComentarios key="blog" tipo="blog" fetchFn={api.comentarios.blog.listar} />
      ) : (
        <TablaComentarios key="servicio" tipo="servicio" fetchFn={api.comentarios.servicio.listar} />
      )}
    </div>
  );
};

export default AdminComentarios;
