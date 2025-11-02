import React, { useEffect, useMemo, useState } from 'react';

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function exportCSV(rows, keys, filename) {
    const escapeCell = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    if (s.search(/[,\n"]/g) >= 0) return '"' + s + '"';
    return s;
    };
    const header = keys.join(',') + '\n';
    const body = rows.map((r) => keys.map((k) => escapeCell(r[k])).join(',')).join('\n');
    const csv = header + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export default function BtnExport({ data = [], fields = null, filenameBase = `export_${new Date().toISOString().slice(0,10)}`, className = '', children = 'Exportar', showControls = true }) {
    // UI state for filtering
    const [exportMode, setExportMode] = useState('all'); // all | month | range
    const [month, setMonth] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const dateFieldCandidates = useMemo(() => {
        if (!data || data.length === 0) return [];
        const keys = Object.keys(data[0]);
        return keys.filter((k) => /date|fecha|created|created_at|updated/i.test(k));
    }, [data]);
    const [dateField, setDateField] = useState(() => dateFieldCandidates[0] || '');

    useEffect(() => {
        if (dateFieldCandidates.length && !dateField) setDateField(dateFieldCandidates[0]);
    }, [dateFieldCandidates, dateField]);

    const parseToDate = (val) => {
        if (!val) return null;
        if (typeof val === 'number') return new Date(val);
        const d = new Date(val);
        if (!isNaN(d)) return d;
        const d2 = new Date(String(val).replace(' ', 'T'));
        if (!isNaN(d2)) return d2;
        return null;
    };

    const filterDataByDate = () => {
        if (!data || data.length === 0) return [];
        if (exportMode === 'all' || !dateField) return data;
        if (exportMode === 'month' && month) {
        const [y, m] = month.split('-').map(Number);
        return data.filter((u) => {                        
            const d = parseToDate(u[dateField]);
            return d && d.getFullYear() === y && d.getMonth() + 1 === m;
        });
        }
        if (exportMode === 'range' && startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        s.setHours(0, 0, 0, 0);
        e.setHours(23, 59, 59, 999);
        return data.filter((u) => {
            const d = parseToDate(u[dateField]);
            return d && d >= s && d <= e;
        });
        }
        return data;
    };

    const handleExport = async () => {
    const rows = filterDataByDate();
    const keys = fields && fields.length ? fields : (rows && rows.length ? Object.keys(rows[0]) : []);

    try {
        const XLSX = await import('xlsx');
        const wsData = [keys, ...rows.map((r) => keys.map((k) => (r[k] == null ? '' : r[k])) )];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        downloadBlob(blob, `${filenameBase}.xlsx`);
        return;
        } catch (err) {
        console.warn('xlsx not available, falling back to CSV', err);
    }

    exportCSV(rows, keys, `${filenameBase}.csv`);
    };

    return (
        <div className="flex items-center gap-2 w-full rounded pb-3 mb-4 transition-all duration-300 ">
        {showControls && (
            <>
            <label className="text-sm dark:text-white dark:bg-bg-dark">Filtro por fecha:</label>
            <select value={exportMode} onChange={(e) => setExportMode(e.target.value)} className="text-sm p-1 rounded dark:bg-bg-dark dark:text-white ml-2 mr-2 cursor-pointer">
                <option value="all">Todos</option>
                <option value="month">Por mes</option>
                <option value="range">Rango de fechas</option>
            </select>

            {exportMode === 'month' && (
                <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="text-sm p-1 rounded  bg-sky-600 hover:bg-sky-700 text-white ml-2 mr-2 " />
            )}

            {exportMode === 'range' && (
                <div>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm p-1 rounded  bg-sky-600 hover:bg-sky-700 text-white ml-2 mr-2 " />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm p-1 rounded  bg-sky-600 hover:bg-sky-700 text-white ml-2 mr-2 " />
                </div>
            )}

            {dateFieldCandidates && dateFieldCandidates.length > 0 && (
                <select value={dateField} onChange={(e) => setDateField(e.target.value)} className="text-sm p-1 rounded dark:bg-bg-dark dark:text-white ml-2 mr-2">
                {dateFieldCandidates.map((f) => (
                    <option key={f} value={f}>{f}</option>
                ))}
                </select>
            )}
            </>
        )}

        <button type="button" onClick={handleExport} className={className}>
            {children}
        </button>
        </div>
    );
}
