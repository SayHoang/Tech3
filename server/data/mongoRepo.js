import { Category } from "./models/index.js";
import { Product } from "./models/index.js";
import { Manufacturer } from "./models/index.js";
import { Detail } from "./models/index.js";
import { Order } from "./models/index.js";
import { User } from "./models/index.js";
import { Review } from "./models/index.js";
import { Cart } from "./models/index.js";
import { Wishlist } from "./models/index.js";
import mongoose from "mongoose";

const values = {
  ASC: 1,
  DESC: -1,
};

function buildOptions(choices, columns) {
  const options = {};
  choices.forEach((option) => {
    // ID_ASC
    const [left, right] = option.split("_");
    const key = columns[left];
    const value = values[right];
    options[key] = value;
  });
  return options;
}

const db = {
  // categories
  categories: {
    getAll: async ({ first, offset, orderBy }) => {
      const query = {};

      const columns = {
        ID: "_id",
        NAME: "name",
      };

      const options = buildOptions(orderBy, columns);

      const totalCount = await Category.find(query)
        .sort(options)
        .countDocuments();
      if (offset >= totalCount) {
        offset = 0;
      }

      const items = await Category.find(query)
        .sort(options)
        .skip(offset)
        .limit(first);
      return {
        items: items,
        totalCount: totalCount,
      };
    },
    create: async ({ name }) => {
      const created = await Category.create({
        name: name,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Category.findById(id);
      return item;
    },
    updateById: async (id, { name }) => {
      const updated = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      if (updated != null) {
        return await Category.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Category.findByIdAndDelete(id);
      return deleted;
    },
  },

  // products
  products: {
    getAll: async ({ first, offset, orderBy, condition }) => {
      const query = {};

      if (condition) {
        if (condition.name) {
          query.name = { $regex: condition.name, $options: "i" };
        }

        if (condition.price) {
          query.price = {};
          if (condition.price.min !== undefined) {
            query.price.$gte = condition.price.min;
          }
          if (condition.price.max !== undefined) {
            query.price.$lte = condition.price.max;
          }
        }

        if (condition.categoryId) {
          query.categoryId = new mongoose.Types.ObjectId(condition.categoryId);
        }

        if (condition.manufacturerId) {
          query.manufacturerId = new mongoose.Types.ObjectId(
            condition.manufacturerId
          );
        }
      }

      const columns = {
        ID: "_id",
        NAME: "name",
        PRICE: "price",
      };

      const options = buildOptions(orderBy, columns);

      const totalCount = await Product.find(query)
        .sort(options)
        .countDocuments();
      if (offset >= totalCount) {
        offset = 0;
      }

      const items = await Product.find(query)
        .sort(options)
        .skip(offset)
        .limit(first);

      return {
        items: items,
        totalCount: totalCount,
      };
    },
    getAllByCategory: async ({ categoryId }) => {
      const query = { categoryId: new mongoose.Types.ObjectId(categoryId) };
      const items = await Product.find(query);
      return items;
    },
    create: async ({ name, price, categoryId, manufacturerId }) => {
      const created = await Product.create({
        name: name,
        price: price,
        categoryId: categoryId,
        manufacturerId: manufacturerId,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Product.findById(id);
      return item;
    },
    updateById: async (id, { name, price, categoryId, manufacturerId }) => {
      const updated = await Product.findByIdAndUpdate(
        id,
        { name, price, categoryId, manufacturerId },
        { new: true }
      );
      if (updated != null) {
        return await Product.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Product.findByIdAndDelete(id);
      return deleted;
    },
  },

  // manufacturers
  manufacturers: {
    getAll: async ({ first = 100, offset = 0, orderBy = [] } = {}) => {
      const query = {};

      const columns = {
        ID: "_id",
        NAME: "name",
      };

      const options = buildOptions(orderBy, columns);
      const totalCount = await Manufacturer.find(query).countDocuments();
      const items = await Manufacturer.find(query)
        .sort(options)
        .skip(offset)
        .limit(first);

      return {
        items: items,
        totalCount: totalCount,
      };
    },
    create: async ({ name }) => {
      const created = await Manufacturer.create({
        name: name,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Manufacturer.findById(id);
      return item;
    },
    updateById: async (id, { name }) => {
      const updated = await Manufacturer.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      if (updated != null) {
        return await Manufacturer.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Manufacturer.findByIdAndDelete(id);
      return deleted;
    },
  },

  // details
  details: {
    getAll: async () => {
      const items = await Detail.find();
      return items;
    },
    create: async ({ name, orderId, productId, quantity, price }) => {
      const created = await Detail.create({
        name: name,
        orderId: orderId,
        productId: productId,
        quantity: quantity,
        price: price,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Detail.findById(id);
      return item;
    },
    updateById: async (id, { name, orderId, productId, quantity, price }) => {
      const updated = await Detail.findByIdAndUpdate(
        id,
        { name, orderId, productId, quantity, price },
        { new: true }
      );
      if (updated != null) {
        return await Detail.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Detail.findByIdAndDelete(id);
      return deleted;
    },
  },

  // orders
  orders: {
    getAll: async () => {
      const items = await Order.find();
      return items;
    },
    create: async ({ customerId, orderDate, totalAmount }) => {
      const created = await Order.create({
        customerId: customerId,
        orderDate: orderDate,
        totalAmount: totalAmount,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Order.findById(id);
      return item;
    },
    updateById: async (id, { customerId, orderDate, totalAmount }) => {
      const updated = await Order.findByIdAndUpdate(
        id,
        { customerId, orderDate, totalAmount },
        { new: true }
      );
      if (updated != null) {
        return await Order.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Order.findByIdAndDelete(id);
      return deleted;
    },
  },

  // reviews
  reviews: {
    findByProductIdCustomerId: async (productId, customerId) => {
      const review = await Review.findByProductIdCustomerId(
        productId,
        customerId
      );
      return review;
    },
    create: async ({ customerId, productId, rating, comment }) => {
      const created = await Review.create({
        customerId,
        productId,
        rating,
        comment,
      });
      return created;
    },
    updateById: async (id, { customerId, productId, rating, comment }) => {
      const updated = await Review.findByIdAndUpdate(
        id,
        { customerId, productId, rating, comment },
        { new: true }
      );
      if (updated != null) {
        return await Review.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Review.findByIdAndDelete(id);
      return deleted;
    },
  },

  // users
  users: {
    findOne: async (username) => {
      return await User.findOne({ username }).lean();
    },
    insertOne: async (user) => {
      return await User.create(user);
    },
  },

  // carts
  carts: {
    findByUserId: async (userId) => {
      return await Cart.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();
    },
    create: async (cartData) => {
      return await Cart.create(cartData);
    },
    addItem: async (userId, item) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(item.productId);

      // Find existing cart or create new one
      let cart = await Cart.findOne({ userId: userObjectId });

      if (!cart) {
        cart = new Cart({
          userId: userObjectId,
          items: [],
        });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.productId.toString() === productObjectId.toString()
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push({
          productId: productObjectId,
          productName: item.productName,
          productPrice: item.productPrice,
          productImageUrl: item.productImageUrl,
          quantity: item.quantity,
        });
      }

      return await cart.save();
    },
    updateItemQuantity: async (userId, productId, quantity) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return await Cart.findOneAndUpdate(
          { userId: userObjectId },
          { $pull: { items: { productId: productObjectId } } },
          { new: true }
        );
      } else {
        // Update quantity
        return await Cart.findOneAndUpdate(
          {
            userId: userObjectId,
            "items.productId": productObjectId,
          },
          { $set: { "items.$.quantity": quantity } },
          { new: true }
        );
      }
    },
    removeItem: async (userId, productId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      return await Cart.findOneAndUpdate(
        { userId: userObjectId },
        { $pull: { items: { productId: productObjectId } } },
        { new: true }
      );
    },
    clearCart: async (userId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      return await Cart.findOneAndUpdate(
        { userId: userObjectId },
        { $set: { items: [] } },
        { new: true }
      );
    },
    deleteCart: async (userId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      return await Cart.findOneAndDelete({ userId: userObjectId });
    },
  },

  // wishlists
  wishlists: {
    findByUserId: async (userId) => {
      return await Wishlist.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).populate({
        path: "items.productId",
        model: "product",
      });
    },
    create: async (wishlistData) => {
      return await Wishlist.create(wishlistData);
    },
    addItem: async (userId, productId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      // Find existing wishlist or create new one
      let wishlist = await Wishlist.findOne({ userId: userObjectId });

      if (!wishlist) {
        wishlist = new Wishlist({
          userId: userObjectId,
          items: [],
        });
      }

      // Check if item already exists in wishlist
      const existingItem = wishlist.items.find(
        (wishlistItem) =>
          wishlistItem.productId.toString() === productObjectId.toString()
      );

      if (existingItem) {
        throw new Error("Product already in wishlist");
      }

      // Add new item
      wishlist.items.push({
        productId: productObjectId,
        addedAt: new Date(),
      });

      const saved = await wishlist.save();
      return await Wishlist.findById(saved._id).populate({
        path: "items.productId",
        model: "product",
      });
    },
    removeItem: async (userId, productId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      const updated = await Wishlist.findOneAndUpdate(
        { userId: userObjectId },
        { $pull: { items: { productId: productObjectId } } },
        { new: true }
      );

      return await Wishlist.findById(updated._id).populate({
        path: "items.productId",
        model: "product",
      });
    },
    clearWishlist: async (userId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      return await Wishlist.findOneAndUpdate(
        { userId: userObjectId },
        { $set: { items: [] } },
        { new: true }
      );
    },
    isProductInWishlist: async (userId, productId) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      const wishlist = await Wishlist.findOne({ userId: userObjectId });
      if (!wishlist) return false;

      return wishlist.items.some(
        (item) => item.productId.toString() === productObjectId.toString()
      );
    },
  },
};

export { db };
