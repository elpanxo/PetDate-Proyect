/**
 * Gráficos ligeros en SVG/CSS — sin dependencias externas.
 * Pensados para el Dashboard de administración de PetDate.
 */

const ChartEmpty = ({ texto = 'Sin datos suficientes para graficar' }) => (
  <div className="admin-chart-empty">{texto}</div>
);

/**
 * Gráfico de línea con área — ideal para mostrar crecimiento en el tiempo.
 * @param {{ data: { label: string, value: number }[], color?: string }} props
 */
export const LineChart = ({ data, color = '#6b8cbf' }) => {
  if (!data || data.length === 0) return <ChartEmpty />;

  const W = 640, H = 240;
  const pad = { t: 24, r: 24, b: 36, l: 40 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;

  const px = (i) => (n === 1 ? pad.l + iw / 2 : pad.l + (i * iw) / (n - 1));
  const py = (v) => pad.t + ih - (v / max) * ih;

  const pts = data.map((d, i) => [px(i), py(d.value)]);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  const area =
    `M ${pts[0][0]},${pad.t + ih} ` +
    pts.map((p) => `L ${p[0]},${p[1]}`).join(' ') +
    ` L ${pts[n - 1][0]},${pad.t + ih} Z`;

  const ticks = [0, max / 2, max];
  // Si hay muchos meses, mostramos una etiqueta sí, otra no, para que no se amontonen.
  const labelStep = n > 12 ? 2 : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="admin-chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={py(t)} x2={W - pad.r} y2={py(t)} stroke="#eef0f5" strokeWidth="1" />
          <text x={pad.l - 8} y={py(t) + 4} textAnchor="end" className="admin-chart-axis">
            {Math.round(t)}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#lineFill)" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      {data.map((d, i) =>
        i % labelStep === 0 ? (
          <text key={i} x={px(i)} y={H - 12} textAnchor="middle" className="admin-chart-axis">
            {d.label}
          </text>
        ) : null
      )}
    </svg>
  );
};

/**
 * Gráfico de dona — ideal para proporciones (ej: citas por estado).
 * @param {{ data: { label: string, value: number, color: string }[], unidad?: string }} props
 */
export const DonutChart = ({ data, unidad = '' }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 60;
  const sw = 26;
  const C = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="admin-donut">
      <svg viewBox="0 0 160 160" className="admin-donut__svg">
        <g transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#eef0f5" strokeWidth={sw} />
          {total > 0 &&
            data.map((d, i) => {
              if (d.value === 0) return null;
              const len = (d.value / total) * C;
              const seg = (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={sw}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += len;
              return seg;
            })}
        </g>
        <text x="80" y="74" textAnchor="middle" className="admin-donut__total">
          {total}
        </text>
        {unidad && (
          <text x="80" y="94" textAnchor="middle" className="admin-donut__caption">
            {unidad}
          </text>
        )}
      </svg>

      <ul className="admin-donut__legend">
        {data.map((d, i) => (
          <li key={i}>
            <span className="admin-donut__dot" style={{ background: d.color }} />
            <span className="admin-donut__label">{d.label}</span>
            <span className="admin-donut__value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Barras horizontales — ideal para comparar cantidades entre categorías.
 * @param {{ data: { label: string, value: number, color: string }[] }} props
 */
export const BarList = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="admin-barlist">
      {data.map((d, i) => (
        <li key={i} className="admin-barlist__row">
          <span className="admin-barlist__label">{d.label}</span>
          <div className="admin-barlist__track">
            <div
              className="admin-barlist__fill"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
          <span className="admin-barlist__value">{d.value}</span>
        </li>
      ))}
    </ul>
  );
};
