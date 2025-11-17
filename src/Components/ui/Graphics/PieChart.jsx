
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// PieChart that fetches data from the backend view /api/viws/TipoBoleto
// and renders a doughnut/pie showing count per ticket type.
const PieChart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
  // server mounts this router at /api/Viws (capital V) in server.cjs
  const res = await fetch('/api/Viws/TipoBoleto');
        const json = await res.json();
        if (!json.success) throw new Error(json.mensaje || 'Error fetching view');

        const rows = Array.isArray(json.registros) ? json.registros : [];

        // Heuristically pick label and value fields
        const pts = rows.map(row => {
          // find label: prefer boleto, tipo, name, label
          const keys = Object.keys(row);
          const labelKey = keys.find(k => /boleto|tipo|name|label/i.test(k)) || keys.find(k => typeof row[k] === 'string') || keys[0];
          // find numeric value: prefer cantidad, total, value, y
          const valueKey = keys.find(k => /cantidad|total|valor|value|y|count|cantidad_total/i.test(k)) || keys.find(k => typeof row[k] === 'number');
          const label = String(row[labelKey] ?? labelKey);
          const value = Number(row[valueKey] ?? Object.values(row).find(v => typeof v === 'number') ?? 0);
          return { label, y: isNaN(value) ? 0 : value };
        });

        if (mounted) setDataPoints(pts);
      } catch (err) {
        console.error('PieChart fetch error', err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const options = {
    animationEnabled: true,
    theme: 'dark2',
    title: {
      text: 'Distribución por tipo de boleto'
    },
    data: [
      {
        type: 'doughnut',
        indexLabel: '{label}: {y}',
        yValueFormatString: '#,###',
        showInLegend: true,
        legendText: '{label}',
        dataPoints: dataPoints
      }
    ]
  };

  if (loading) return <div>Cargando gráfica...</div>;
  if (error) return <div className="text-red-500">Error al cargar gráfica: {error}</div>;

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default PieChart;