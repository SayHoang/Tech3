import jwt from "jsonwebtoken";

export const typeDef = `
  type WishlistItem {
    _id: ID!
    productId: ID!
    product: Product!
    addedAt: DateTime!
  }

  type Wishlist {
    _id: ID!
    userId: ID!
    items: [WishlistItem!]!
    itemCount: Int!
  }

  extend type Query {
    wishlist: Wishlist
    isProductInWishlist(productId: ID!): Boolean!
  }

  extend type Mutation {
    addToWishlist(productId: ID!): Wishlist!
    removeFromWishlist(productId: ID!): Wishlist!
    clearWishlist: Wishlist!
    moveWishlistToCart(productId: ID!): Cart!
  }
`;

export const resolvers = {
  Query: {
    wishlist: async (parent, args, context, info) => {
      // Check if user is authenticated
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem danh sách yêu thích");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username to get userId
        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        let wishlist = await context.db.wishlists.findByUserId(user._id);

        // Create empty wishlist if doesn't exist
        if (!wishlist) {
          wishlist = await context.db.wishlists.create({
            userId: user._id,
            items: [],
          });
        }

        return {
          _id: wishlist._id,
          userId: wishlist.userId,
          items: wishlist.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            addedAt: item.addedAt,
          })),
          itemCount: wishlist.items.length,
        };
      } catch (error) {
        throw new Error("Token không hợp lệ");
      }
    },

    isProductInWishlist: async (parent, { productId }, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        return false;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          return false;
        }

        return await context.db.wishlists.isProductInWishlist(
          user._id,
          productId
        );
      } catch (error) {
        return false;
      }
    },
  },

  Mutation: {
    addToWishlist: async (parent, { productId }, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để thêm vào danh sách yêu thích");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username to get userId
        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        // Verify product exists
        const product = await context.db.products.findById(productId);
        if (!product) {
          throw new Error("Sản phẩm không tồn tại");
        }

        const wishlist = await context.db.wishlists.addItem(
          user._id,
          productId
        );

        return {
          _id: wishlist._id,
          userId: wishlist.userId,
          items: wishlist.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            addedAt: item.addedAt,
          })),
          itemCount: wishlist.items.length,
        };
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    removeFromWishlist: async (parent, { productId }, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xóa khỏi danh sách yêu thích");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const wishlist = await context.db.wishlists.removeItem(
          user._id,
          productId
        );
        if (!wishlist) {
          throw new Error("Wishlist not found");
        }

        return {
          _id: wishlist._id,
          userId: wishlist.userId,
          items: wishlist.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            addedAt: item.addedAt,
          })),
          itemCount: wishlist.items.length,
        };
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    clearWishlist: async (parent, args, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xóa danh sách yêu thích");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        const wishlist = await context.db.wishlists.clearWishlist(user._id);
        if (!wishlist) {
          throw new Error("Wishlist not found");
        }

        return {
          _id: wishlist._id,
          userId: wishlist.userId,
          items: [],
          itemCount: 0,
        };
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },

    moveWishlistToCart: async (parent, { productId }, context, info) => {
      const token = context.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Bạn cần đăng nhập để chuyển vào giỏ hàng");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username to get userId
        const user = await context.db.users.findOne(username);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }

        // Get product details
        const product = await context.db.products.findById(productId);
        if (!product) {
          throw new Error("Sản phẩm không tồn tại");
        }

        // Add to cart
        const cartItem = {
          productId,
          productName: product.name,
          productPrice: product.price,
          productImageUrl: product.imageUrl,
          quantity: 1,
        };

        const cart = await context.db.carts.addItem(user._id, cartItem);

        // Remove from wishlist
        await context.db.wishlists.removeItem(user._id, productId);

        return cart;
      } catch (error) {
        if (error.message.includes("Token") || error.message.includes("jwt")) {
          throw new Error("Token không hợp lệ");
        }
        throw error;
      }
    },
  },
};
