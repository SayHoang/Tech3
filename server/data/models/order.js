import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let ObjectId = Schema.Types.ObjectId;

const OrderItemSchema = new Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

export const OrderSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    // Legacy fields for backward compatibility
    customerId: Number,
    orderDate: String,
    customer: { type: ObjectId, ref: "customer" },
  },
  {
    collection: "orders",
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

export const Order = mongoose.model("order", OrderSchema);
