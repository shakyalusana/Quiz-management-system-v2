import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

subCategorySchema.index(
  {
    category: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("SubCategory", subCategorySchema);
