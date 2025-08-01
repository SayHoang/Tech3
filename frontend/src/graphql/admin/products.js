import { gql } from "@apollo/client";

// Get all products with pagination and filtering for admin
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts(
    $first: Int
    $offset: Int
    $condition: ProductConnectionInput
    $orderBy: [ProductsOrderBy!]
  ) {
    products(
      first: $first
      offset: $offset
      condition: $condition
      orderBy: $orderBy
    ) {
      nodes {
        _id
        name
        price
        categoryId
        categoryName
        manufacturerId
        manufacturerName
        imageUrl
      }
      totalCount
    }
  }
`;

// Get single product by ID
export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($_id: ID!) {
    product(_id: $_id) {
      _id
      name
      price
      categoryId
      categoryName
      manufacturerId
      manufacturerName
      imageUrl
    }
  }
`;

// Create new product
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      _id
      name
      price
      categoryId
      categoryName
      manufacturerId
      manufacturerName
      imageUrl
    }
  }
`;

// Update existing product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($_id: ID!, $input: ProductInput!) {
    updateProduct(_id: $_id, input: $input) {
      _id
      name
      price
      categoryId
      categoryName
      manufacturerId
      manufacturerName
      imageUrl
    }
  }
`;

// Delete product
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($_id: ID!) {
    deleteProduct(_id: $_id)
  }
`;

// Get all categories for dropdown
export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($orderBy: [CategoriesOrderBy!]) {
    categories(orderBy: $orderBy) {
      nodes {
        _id
        name
      }
      totalCount
    }
  }
`;

// Get all manufacturers for dropdown
export const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers($orderBy: [ManufacturersOrderBy!]) {
    manufacturers(orderBy: $orderBy) {
      nodes {
        _id
        name
      }
      totalCount
    }
  }
`;
