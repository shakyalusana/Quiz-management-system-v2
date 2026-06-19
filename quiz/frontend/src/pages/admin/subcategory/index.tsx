import { CATEGORYAPI } from "@/api/categoryApi";
import { SUBCATEGORYAPI } from "@/api/subcatgeoryApi";
import { useState } from "react";
import { toast } from "sonner";

const AdminSubCategory = () => {
  const { data: subCategories = [], isLoading } =
    SUBCATEGORYAPI.useSubCategories();

  const { data: categories = [] } = CATEGORYAPI.useCategories();

  const createSubCategory = SUBCATEGORYAPI.useCreateSubCategory();

  const deleteSubCategory = SUBCATEGORYAPI.useDeleteSubCategory();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [category, setCategory] = useState("");

  // CREATE SUBCATEGORY
  const handleCreate = async () => {
    try {
      if (!name.trim()) {
        return toast.error("SubCategory name required");
      }

      if (!category) {
        return toast.error("Please select category");
      }

      await createSubCategory.mutateAsync({
        name,
        category,
      });

      toast.success("SubCategory created");

      setName("");

      setCategory("");

      setOpen(false);
    } catch (err) {
      toast.error("Failed to create subcategory");
    }
  };

  // DELETE SUBCATEGORY
  const handleDelete = async (id: string) => {
    try {
      await deleteSubCategory.mutateAsync(id);

      toast.success("SubCategory deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading subcategories...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sub Categories</h1>

        <button
          onClick={() => setOpen(true)}
          className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-xl
          "
        >
          Add SubCategory
        </button>
      </div>

      {/* TABLE */}

      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">SubCategory Name</th>

              <th className="p-3 text-left">Category</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subCategories.map((sub) => (
              <tr
                key={sub._id}
                className="
                border-t
                hover:bg-gray-50
                "
              >
                <td className="p-3 font-medium">{sub.name}</td>

                <td className="p-3">{sub.category?.name}</td>

                <td className="p-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="
                      text-red-600
                      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {subCategories.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="
                  text-center
                  p-6
                  text-gray-500
                  "
                >
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {open && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-50
          "
        >
          <div
            className="
            bg-white
            rounded-2xl
            p-6
            w-full
            max-w-md
            "
          >
            <h2
              className="
              text-xl
              font-bold
              mb-4
            "
            >
              Add SubCategory
            </h2>

            {/* CATEGORY SELECT */}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
              w-full
              border
              rounded-xl
              p-3
              mb-4
              "
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* NAME INPUT */}

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="
              SubCategory name
              "
              className="
              w-full
              border
              rounded-xl
              p-3
              mb-4
              "
            />

            <div
              className="
              flex
              justify-end
              gap-3
              "
            >
              <button
                onClick={() => setOpen(false)}
                className="
                px-4
                py-2
                bg-gray-200
                rounded-xl
                "
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="
                px-4
                py-2
                bg-blue-600
                text-white
                rounded-xl
                "
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

export default AdminSubCategory;
