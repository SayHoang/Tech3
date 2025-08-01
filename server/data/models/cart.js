import mongoose from "mongoose";
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let Number = Schema.Types.Number;

export const CartSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "user", required: true },
    items: [
      {
        productId: { type: ObjectId, ref: "product", required: true },
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true },
        productImageUrl: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        selectedSize: { type: String },
        selectedColor: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
CartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.productPrice,
    0
  );
  this.lastUpdated = new Date();
  next();
});

export const Cart = mongoose.model("cart", CartSchema);
