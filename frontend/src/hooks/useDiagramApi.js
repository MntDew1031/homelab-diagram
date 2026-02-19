import { useState, useCallback, useRef } from 'react';

const API_BASE = '/api';

export function useDiagramApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const saveTimerRef = useRef(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'Request failed');
      }
      return await res.json();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const listDiagrams = useCallback(() => request('/diagrams'), [request]);

  const getDiagram = useCallback((id) => request(`/diagrams/${id}`), [request]);

  const createDiagram = useCallback(
    (data) => request('/diagrams', { method: 'POST', body: JSON.stringify(data) }),
    [request]
  );

  const saveDiagram = useCallback(
    (id, data) => request(`/diagrams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    [request]
  );

  const deleteDiagram = useCallback(
    (id) => request(`/diagrams/${id}`, { method: 'DELETE' }),
    [request]
  );

  const listTemplates = useCallback(() => request('/templates'), [request]);

  const createFromTemplate = useCallback(
    (templateId) => request(`/diagrams/from-template/${templateId}`, { method: 'POST' }),
    [request]
  );

  const debouncedSave = useCallback(
    (id, data, delay = 2000) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveDiagram(id, data).catch(console.error);
      }, delay);
    },
    [saveDiagram]
  );

  return {
    loading,
    error,
    listDiagrams,
    getDiagram,
    createDiagram,
    saveDiagram,
    deleteDiagram,
    listTemplates,
    createFromTemplate,
    debouncedSave,
  };
}
