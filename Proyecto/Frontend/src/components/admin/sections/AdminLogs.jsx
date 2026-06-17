import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '../../../api/petdate-api';
import { AdminPagination } from './AdminUsuarios';

const RESULTADO_COLOR = {
  EXITOSO: '#6aab8e',
  DENEGADO: '#e07b54',
  ERROR: '#c0392b',
};

const AdminLogs = () => {
  const [data, setData]           = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [page, setPage]           = useState(0);
  const [filtroRecurso, setFiltroRecurso] = useState('');

  const RECURSOS = ['usuarios', 'mascotas', 'citas', 'servicios', 'blogs', 'comentarios', 'promociones'];

  const load = useCallback(async (p = 0, recurso = '') => {
    setLoading(true);
    setError('');
    try {
      const res = recurso
        ? await api.auditoria.porRecurso(recurso, { page: p, size: 20 })
        : await api.auditoria.listar({ page: p, size: 20 });
      setData(res);
    } catch {
      setError('No se pudieron cargar los logs de auditoría.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, filtroRecurso); }, [load, page, filtroRecurso]);

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h1 className="admin-section__title">Logs de Auditoría</h1>
          <p className="admin-section__sub">Registro de accesos a datos personales (Ley 19.628)</p>
        </div>
        <div className="admin-section__actions">
          <select
            className="admin-select"
            value={filtroRecurso}
            onChange={(e) => { setFiltroRecurso(e.target.value); setPage(0); }}
          >
            <option value="">Todos los recursos</option>
            {RECURSOS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="admin-btn admin-btn--ghost" onClick={() => load(page, filtroRecurso)}>
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
            <table className="admin-table admin-table--compact">
              <thead>
                <tr>
                  <th>Fecha/Hora</th><th>Usuario ID</th><th>Rol</th><th>Método</th>
                  <th>Ruta</th><th>Recurso</th><th>Status</th><th>Resultado</th><th>IP</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr><td colSpan={9} className="admin-table__empty">Sin registros</td></tr>
                ) : data.content.map((log) => (
                  <tr key={log.id}>
                    <td className="admin-table__mono">
                      {log.fechaHora ? new Date(log.fechaHora).toLocaleString('es-CL') : '—'}
                    </td>
                    <td>{log.usuarioId ?? 'ANÓNIMO'}</td>
                    <td>
                      <span className="admin-badge admin-badge--outline">{log.rol || '—'}</span>
                    </td>
                    <td>
                      <span className={`admin-method admin-method--${log.metodo?.toLowerCase()}`}>
                        {log.metodo}
                      </span>
                    </td>
                    <td className="admin-table__mono admin-table__text-cell">{log.ruta}</td>
                    <td>{log.recurso || '—'}</td>
                    <td>{log.status}</td>
                    <td>
                      <span
                        className="admin-badge"
                        style={{ background: RESULTADO_COLOR[log.resultado] || '#999' }}
                      >
                        {log.resultado}
                      </span>
                    </td>
                    <td className="admin-table__mono">{log.direccionIp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AdminLogs;
