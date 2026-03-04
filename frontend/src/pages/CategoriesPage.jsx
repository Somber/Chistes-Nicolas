import { useState } from 'react';
import { categories as initialCategories } from '../data/mockData';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const openNewModal = () => {
    setEditingCategory(null);
    setFormName('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      // Editar
      setCategories(cats =>
        cats.map(c => c.id === editingCategory.id ? { ...c, name: formName } : c)
      );
    } else {
      // Crear
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      setCategories(cats => [...cats, { id: newId, name: formName }]);
    }
    closeModal();
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      setCategories(cats => cats.filter(c => c.id !== deleteConfirm.id));
      // Si estábamos en una página que ya no existe, retroceder
      const newTotalPages = Math.ceil((categories.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h2>Categorías</h2>
        <button className="btn-primary" onClick={openNewModal}>
          Nueva categoría
        </button>
      </div>

      <table className="datatable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th className="actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
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
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal Alta/Edición */}
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
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar la categoría <strong>{deleteConfirm.name}</strong>?</p>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={handleDeleteCancel}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
