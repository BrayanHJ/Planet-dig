import { create } from 'zustand';
import { UserStore } from './UserStore.jsx';

// LogStore keeps recent logs locally and attempts to send them to the backend
export const useLogStore = create((set, get) => ({
    logs: [], // local cache of logs

    // add a log entry and attempt to POST to backend
    addLog: async ({ Accion = '', Detalle = '' } = {}) => {
        try {
            const userState = UserStore.getState();
                    const payload = {
                        accion: Accion,
                        detalle: Detalle,
                        id_usuario: userState.idUser ?? null,
                        usuario: userState.User ?? null,
                        permiso: userState.Rol ?? null
                    };

            // add to local cache
            set(state => ({ logs: [...state.logs, payload] }));

            // try to send to backend (best-effort)
            try {
                await fetch('/api/Activity_Log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (sendErr) {
                // swallow network errors but keep local cache
                console.warn('useLogStore: failed to send log to backend', sendErr);
            }

            return true;
        } catch (err) {
            console.error('useLogStore.addLog error', err);
            return false;
        }
    },

    // convenience to get current logs
    getLogs: () => get().logs
}));
