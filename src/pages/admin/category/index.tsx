import { CATEGORYAPI } from "@/api/categoryApi";
import { useState } from "react";
import { toast } from "sonner";

const AdminCategory = () => {
  const { data: categories = [], isLoading } = CATEGORYAPI.useCategories();

  const createCategory = CATEGORYAPI.useCreateCategory();

  const deleteCategory = CATEGORYAPI.useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  // CREATE CATEGORY
  const handleCreate = async () => {
    try {
      if (!name.trim()) {
        return toast.error("Category name required");
      }

      await createCategory.mutateAsync({
        name,
      });

      toast.success("Category created");
      setName("");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  // DELETE CATEGORY
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Add Category
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{cat.name}</td>

                <td className="p-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center p-6 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full border rounded-xl p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
