import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, RefreshCw, Search, X } from 'lucide-react';
import api, { BASE_URL } from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const AdminServicios = () => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [busqueda, setBusqueda]   = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.servicios.listar({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar los servicios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este servicio? Se eliminarán también sus blogs y promociones.')) return;
    try {
      await api.servicios.eliminar(id);
      load(page);
    } catch {
      alert('No se pudo eliminar el servicio.');
    }
  };

  const tiposUnicos = [...new Set(data.content.map((s) => s.tipoServicio).filter(Boolean))].sort();

  const filteredContent = data.content.filter((s) => {
    const matchTipo = !filtroTipo || s.tipoServicio === filtroTipo;
    const matchBusqueda = !busqueda || (() => {
      const q = busqueda.toLowerCase();
      return (
        s.nombreServicio?.toLowerCase().includes(q) ||
        s.correo?.toLowerCase().includes(q) ||
        s.comuna?.toLowerCase().includes(q) ||
        s.rutEmpresa?.toLowerCase().includes(q)
      );
    })();
    return matchTipo && matchBusqueda;
  });

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Servicios</h1>
          <p className="admin-section__sub">Empresas y negocios registrados en la plataforma</p>
        </div>
        <div className="admin-section__actions">
          <div className="admin-search">
            <Search size={15} className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por nombre, comuna..."
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
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tiposUnicos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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
                  <th>ID</th><th>Logo</th><th>Nombre</th><th>Tipo</th>
                  <th>Correo</th><th>Comuna</th><th>RUT</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={8} className="admin-table__empty">Sin resultados</td></tr>
                ) : filteredContent.map((s) => (
                  <tr key={s.idServicio}>
                    <td>{s.idServicio}</td>
                    <td>
                      {s.imagenUrl
                        ? <img src={`${BASE_URL}${s.imagenUrl}`} alt="" className="admin-table__thumb" />
                        : <span className="admin-table__no-img">—</span>
                      }
                    </td>
                    <td>{s.nombreServicio}</td>
                    <td>{s.tipoServicio}</td>
                    <td>{s.correo}</td>
                    <td>{s.comuna || '—'}</td>
                    <td>{s.rutEmpresa}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(s.idServicio)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!busqueda && !filtroTipo && (
            <AdminPagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          )}
          {(busqueda || filtroTipo) && filteredContent.length > 0 && (
            <p className="admin-pagination__info" style={{ textAlign: 'center', marginTop: 12 }}>
              {filteredContent.length} resultado{filteredContent.length !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminServicios;
