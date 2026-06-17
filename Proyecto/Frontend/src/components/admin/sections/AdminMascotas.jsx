import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, RefreshCw, Search, X } from 'lucide-react';
import api from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const AdminMascotas = () => {
  const [data, setData]       = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(0);
  const [busqueda, setBusqueda]   = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState('');

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.mascotas.listar({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar las mascotas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta mascota?')) return;
    try {
      await api.mascotas.eliminar(id);
      load(page);
    } catch {
      alert('No se pudo eliminar la mascota.');
    }
  };

  const especiesUnicas = [...new Set(data.content.map((m) => m.especie).filter(Boolean))].sort();

  const filteredContent = data.content.filter((m) => {
    const matchEspecie = !filtroEspecie || m.especie === filtroEspecie;
    const matchBusqueda = !busqueda || (() => {
      const q = busqueda.toLowerCase();
      return (
        m.nombre?.toLowerCase().includes(q) ||
        m.raza?.toLowerCase().includes(q) ||
        m.especie?.toLowerCase().includes(q) ||
        String(m.usuarioId).includes(q)
      );
    })();
    return matchEspecie && matchBusqueda;
  });

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Mascotas</h1>
          <p className="admin-section__sub">Todas las mascotas registradas en la plataforma</p>
        </div>
        <div className="admin-section__actions">
          <div className="admin-search">
            <Search size={15} className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por nombre, raza..."
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
            value={filtroEspecie}
            onChange={(e) => setFiltroEspecie(e.target.value)}
          >
            <option value="">Todas las especies</option>
            {especiesUnicas.map((e) => (
              <option key={e} value={e}>{e}</option>
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
                  <th>ID</th><th>Nombre</th><th>Especie</th><th>Raza</th>
                  <th>Edad</th><th>Sexo</th><th>Dueño ID</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length === 0 ? (
                  <tr><td colSpan={8} className="admin-table__empty">Sin resultados</td></tr>
                ) : filteredContent.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.nombre}</td>
                    <td>{m.especie}</td>
                    <td>{m.raza}</td>
                    <td>{m.edad} años</td>
                    <td>{m.sexo}</td>
                    <td>{m.usuarioId}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => eliminar(m.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!busqueda && !filtroEspecie && (
            <AdminPagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          )}
          {(busqueda || filtroEspecie) && filteredContent.length > 0 && (
            <p className="admin-pagination__info" style={{ textAlign: 'center', marginTop: 12 }}>
              {filteredContent.length} resultado{filteredContent.length !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminMascotas;
