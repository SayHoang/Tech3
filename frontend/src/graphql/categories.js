import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories(
    $first: Int
    $offset: Int
    $orderBy: [CategoriesOrderBy!]
  ) {
    categories(first: $first, offset: $offset, orderBy: $orderBy) {
      nodes {
        _id
        name
      }
      totalCount
    }
  }
`;

export const CATEGORY_BY_ID = gql`
  query GetCategoryById($id: ID!) {
    category(_id: $id) {
      _id
      name
    }
  }
`;
