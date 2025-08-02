import mongoose from "mongoose";
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const WishlistItemSchema = new Schema({
  productId: { type: ObjectId, ref: "product", required: true },
  addedAt: { type: Date, default: Date.now },
});

export const WishlistSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "user", required: true, unique: true },
    items: [WishlistItemSchema],
  },
  {
    collection: "wishlists",
    timestamps: true,
  }
);

export const Wishlist = mongoose.model("wishlist", WishlistSchema);
