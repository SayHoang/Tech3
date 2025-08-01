import { gql } from "@apollo/client";

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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(_id: $id) {
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!, $first: Int, $offset: Int) {
    productsByCategory(
      categoryId: $categoryId
      first: $first
      offset: $offset
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
