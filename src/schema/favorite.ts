import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    recipeId: {
      type: Number,
      required: true,
    },
    title: String,
    image: String,
  },
  { timestamps: true }
);

// evitar duplicados por usuario
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);