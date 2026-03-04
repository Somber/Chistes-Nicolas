import { useEffect, useMemo, useState } from 'react';
import './CategoriesPage.css';

const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:3000`;
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = resolveApiBaseUrl();

async function parseError(response) {
  try {
    const body = await response.json();
    return body?.message || body?.error || `Error HTTP ${response.status}`;
  } catch {
    return `Error HTTP ${response.status}`;
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const itemsPerPage = 5;

  const sortedCategories = useMemo(() => {
    const sorted = [...categories];
    sorted.sort((a, b) => {
      const av = String(a?.[sortKey] ?? '').toLowerCase();
      const bv = String(b?.[sortKey] ?? '').toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [categories, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentCategories = useMemo(
    () => sortedCategories.slice(startIndex, endIndex),
    [sortedCategories, startIndex, endIndex]
  );

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(await parseError(response));
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openNewModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormName(category.name || '');
    setFormDescription(category.description || '');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const isEditing = Boolean(editingCategory);
      const url = isEditing
        ? `${API_BASE_URL}/api/categories/${editingCategory.id}`
        : `${API_BASE_URL}/api/categories`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null
        })
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      await loadCategories();
      setSuccess(isEditing ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.');
      closeModal();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
    setError('');
    setSuccess('');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${deleteConfirm.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('No se puede eliminar la categoría porque tiene chistes asociados.');
        }
        throw new Error(await parseError(response));
      }

      await loadCategories();
      setSuccess('Categoría eliminada correctamente.');
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la categoría');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (deleting) return;
    setDeleteConfirm(null);
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h2>Categorías</h2>
        <button className="btn-primary" onClick={openNewModal} disabled={loading}>
          Nueva categoría
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <>
          <table className="datatable">
            <thead>
              <tr>
                <th>
                  <button className="sort-btn" onClick={() => toggleSort('name')} type="button">
                    Nombre {sortIndicator('name')}
                  </button>
                </th>
                <th>
                  <button className="sort-btn" onClick={() => toggleSort('description')} type="button">
                    Descripción {sortIndicator('description')}
                  </button>
                </th>
                <th className="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan={3}>No hay categorías todavía.</td>
                </tr>
              ) : (
                currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openEditModal(category)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteClick(category)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {sortedCategories.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCategory ? 'Editar categoría' : 'Nueva categoría'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="categoryName">Nombre:</label>
                <input
                  id="categoryName"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryDescription">Descripción:</label>
                <textarea
                  id="categoryDescription"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={closeModal} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Guardando...' : editingCategory ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que quieres eliminar la categoría <strong>{deleteConfirm.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={handleDeleteCancel} disabled={deleting}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
