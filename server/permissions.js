import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const isAdminOrManager = async (next, parent, args, context, info) => {
  const token = context.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new GraphQLError("You are not authorized to access this resource");
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );
    if (decoded.role !== "admin" && decoded.role !== "manager") {
      throw new GraphQLError("You are not authorized to access this resource");
    }
    return next();
  } catch (error) {
    throw new GraphQLError("You are not authorized to access this resource");
  }
};

const isCustomer = async (next, parent, args, context, info) => {
  const token = context.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new GraphQLError("You are not authorized to access this resource");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );
    if (decoded.role !== "customer") {
      throw new GraphQLError("You are not authorized to access this resource");
    }
    return next();
  } catch (error) {
    throw new GraphQLError("You are not authorized to access this resource");
  }
};

export const permissions = {
  Query: {
    // details: isAdminOrManager, isCustomer,
    // orders: isAdminOrManager, isCustomer,
  },
  Mutation: {
    // products
    createProduct: isAdminOrManager,
    updateProduct: isAdminOrManager,
    deleteProduct: isAdminOrManager,

    // categories
    createCategory: isAdminOrManager,
    updateCategory: isAdminOrManager,
    deleteCategory: isAdminOrManager,

    // manufacturers
    createManufacturer: isAdminOrManager,
    updateManufacturer: isAdminOrManager,
    deleteManufacturer: isAdminOrManager,

    // details
    createDetail: isAdminOrManager,
    updateDetail: isAdminOrManager,
    deleteDetail: isAdminOrManager,

    // orders
    createOrder: isAdminOrManager,
    updateOrder: isAdminOrManager,

    // upload
    upload: isAdminOrManager,

    // reviews
    updateReview: isAdminOrManager,
    deleteReview: isAdminOrManager,
  },
};
