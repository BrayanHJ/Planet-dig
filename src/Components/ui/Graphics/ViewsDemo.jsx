import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const views = [
  { key: 'PersonasPorDia', label: 'Personas por día' },
  { key: 'TipoBoleto', label: 'Estadística por tipo' },
  { key: 'Mensual', label: 'Estadística mensual' },
  { key: 'DiariaReal', label: 'Estadística diaria real' },
  { key: 'DiariaDetallada', label: 'Estadística diaria detallada' },
  { key: 'Diaria', label: 'Estadística diaria' },
  { key: 'Anual', label: 'Estadística anual' }
];

const ViewsDemo = () => {
  const [state, setState] = useState(() => {
    const s = {};
    views.forEach(v => { s[v.key] = { loading: true, error: null, rows: [] }; });
    return s;
  });

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      const promises = views.map(v =>
        fetch(`/api/Viws/${v.key}`).then(async res => {
          const text = await res.text();
          try {
            return { key: v.key, ok: res.ok, json: JSON.parse(text) };
          } catch {
            // not json
            return { key: v.key, ok: res.ok, json: null, text };
          }
        }).catch(err => ({ key: v.key, ok: false, error: String(err) }))
      );

      const results = await Promise.all(promises);
      if (!mounted) return;
      const next = { ...state };
      results.forEach(r => {
        if (r.error) {
          next[r.key] = { loading: false, error: r.error, rows: [] };
          return;
        }
        if (!r.ok) {
          next[r.key] = { loading: false, error: r.text || 'HTTP error', rows: [] };
          return;
        }
        if (!r.json || !r.json.success) {
          next[r.key] = { loading: false, error: (r.json && r.json.mensaje) || 'Respuesta no válida', rows: Array.isArray(r.json && r.json.registros) ? r.json.registros : [] };
          return;
        }
        const rows = Array.isArray(r.json.registros) ? r.json.registros : [];
        next[r.key] = { loading: false, error: null, rows };
      });
      setState(next);
    };
    fetchAll();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Demo: todas las Views</h2>
      {views.map(v => {
        const s = state[v.key] || { loading: true, error: null, rows: [] };
        return (
          <section key={v.key} className="border rounded p-3 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{v.label} <span className="text-sm text-gray-500">({v.key})</span></h3>
              <div className="text-sm text-gray-600">
                {s.loading ? 'Cargando...' : s.error ? <span className="text-red-500">Error</span> : `${s.rows.length} filas`}
              </div>
            </div>
            <div className="mt-2 text-sm">
              {/* small chart: try to heuristically map label and numeric value */}
              {(!s.loading && !s.error && s.rows.length > 0) && (() => {
                try {
                  const rows = s.rows;
                  const keys = Object.keys(rows[0]);
                  const labelKey = keys.find(k => /boleto|tipo|name|label/i.test(k)) || keys.find(k => typeof rows[0][k] === 'string') || keys[0];
                  const valueKey = keys.find(k => /cantidad|total|valor|value|y|count|cantidad_total/i.test(k)) || keys.find(k => typeof rows[0][k] === 'number');
                  if (!valueKey) return null;

                  // group by labelKey
                  const map = {};
                  rows.forEach(r => {
                    const label = String(r[labelKey] ?? '');
                    const v = Number(r[valueKey] ?? Object.values(r).find(vv => typeof vv === 'number') ?? 0);
                    if (!map[label]) map[label] = 0;
                    map[label] += isNaN(v) ? 0 : v;
                  });
                  const pts = Object.keys(map).map(k => ({ label: k, y: map[k] }));
                  if (pts.length === 0) return null;

                  const chartOptions = {
                    animationEnabled: false,
                    theme: 'light2',
                    height: 180,
                    data: [
                      {
                        type: pts.length <= 8 ? 'doughnut' : 'column',
                        indexLabel: '{label}: {y}',
                        dataPoints: pts
                      }
                    ]
                  };

                  return (
                    <div className="mb-2">
                      <div style={{ height: 180 }}>
                        <CanvasJSChart options={chartOptions} />
                      </div>
                    </div>
                  );
                } catch {
                  return null;
                }
              })()}
              {s.loading && <div>Cargando...</div>}
              {s.error && <pre className="text-xs text-red-500 break-words">{String(s.error)}</pre>}
              {!s.loading && !s.error && s.rows.length === 0 && <div className="text-gray-500">Sin registros</div>}
              {!s.loading && !s.error && s.rows.length > 0 && (
                <div className="overflow-auto mt-2">
                  <table className="w-full text-sm table-auto border-collapse">
                    <thead>
                      <tr className="text-left">
                        {Object.keys(s.rows[0]).slice(0,6).map(k => (
                          <th key={k} className="px-2 py-1 border-b">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.rows.slice(0,5).map((r, i) => (
                        <tr key={i} className="align-top border-t">
                          {Object.keys(s.rows[0]).slice(0,6).map(k => (
                            <td key={k} className="px-2 py-1 align-top">{String(r[k] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {s.rows.length > 5 && <div className="text-xs text-gray-500 mt-1">Mostrando primeras 5 filas de {s.rows.length}</div>}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ViewsDemo;
