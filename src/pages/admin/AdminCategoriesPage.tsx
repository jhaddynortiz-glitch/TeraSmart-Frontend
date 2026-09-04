import React, { useEffect, useState } from 'react';
import { categoryService, Category } from '../../services/categoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash, faSpinner, faExclamationTriangle, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError('Error al cargar la lista de categorías del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await (categoryService as any).updateCategory(editingCategory.id, { name, description, imageUrl });
      } else {
        await categoryService.createCategory({ name, description, imageUrl });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert('Error al guardar categoría: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await (categoryService as any).deleteCategory(deleteModal.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err: any) {
      alert('Error al eliminar categoría: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} />
            <span>Gestión de Categorías</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra las categorías principales de productos para la navegación del catálogo.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Crear Categoría</span>
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500">Cargando categorías...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Descripción</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base flex-shrink-0">
                        {cat.name.charAt(0)}
                      </div>
                      <span>{cat.name}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                      {cat.description || 'Sin descripción'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 text-slate-700 dark:text-slate-200 hover:text-sky-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => setDeleteModal(cat)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 text-slate-700 dark:text-slate-200 hover:text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Audio & Fotografía"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-sm dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción informativa de la categoría..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-sm dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Eliminar Categoría?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ¿Deseas eliminar la categoría <strong>{deleteModal.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-xl">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
