import jwt from "jsonwebtoken";

export const typeDef = `
  type CartItem {
    productId: ID!
    productName: String!
    productPrice: Float!
    productImageUrl: String
    quantity: Int!
    selectedSize: String
    selectedColor: String
    addedAt: DateTime
  }

  type Cart {
    _id: ID!
    userId: ID!
    items: [CartItem!]!
    totalItems: Int!
    totalPrice: Float!
    lastUpdated: DateTime
  }

  input CartItemInput {
    productId: ID!
    productName: String!
    productPrice: Float!
    productImageUrl: String
    quantity: Int!
    selectedSize: String
    selectedColor: String
  }

  extend type Query {
    cart: Cart
    cartItemCount: Int!
  }

  extend type Mutation {
    addToCart(item: CartItemInput!): Cart!
    updateCartItemQuantity(productId: ID!, quantity: Int!): Cart!
    removeFromCart(productId: ID!): Cart!
    clearCart: Cart!
  }
`;

export const resolvers = {
  Query: {
    cart: async (parent, args, context, info) => {
      // Check if user is authenticated
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username to get userId
        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const cart = await context.db.carts.findByUserId(user._id);
        return (
          cart || {
            _id: null,
            userId: user._id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            lastUpdated: new Date(),
          }
        );
      } catch (error) {
        throw new Error("Token không hợp lệ");
      }
    },

    cartItemCount: async (parent, args, context, info) => {
      // Check if user is authenticated
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        return 0; // Return 0 for unauthenticated users
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          return 0;
        }

        const cart = await context.db.carts.findByUserId(user._id);
        return cart ? cart.totalItems : 0;
      } catch (error) {
        return 0;
      }
    },
  },

  Mutation: {
    addToCart: async (parent, { item }, context, info) => {
      // Check if user is authenticated
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username to get userId
        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        // Validate product exists
        const product = await context.db.products.findById(item.productId);
        if (!product) {
          throw new Error("Sản phẩm không tồn tại");
        }

        // Add item to cart
        const cart = await context.db.carts.addItem(user._id, item);
        return cart;
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    updateCartItemQuantity: async (
      parent,
      { productId, quantity },
      context,
      info
    ) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để cập nhật giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const cart = await context.db.carts.updateItemQuantity(
          user._id,
          productId,
          quantity
        );
        return (
          cart || {
            _id: null,
            userId: user._id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            lastUpdated: new Date(),
          }
        );
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    removeFromCart: async (parent, { productId }, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const cart = await context.db.carts.removeItem(user._id, productId);

        return (
          cart || {
            _id: null,
            userId: user._id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            lastUpdated: new Date(),
          }
        );
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    clearCart: async (parent, args, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xóa giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const cart = await context.db.carts.clearCart(user._id);
        return (
          cart || {
            _id: null,
            userId: user._id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            lastUpdated: new Date(),
          }
        );
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },
  },
};
