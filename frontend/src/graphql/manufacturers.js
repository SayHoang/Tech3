import { gql } from "@apollo/client";

export const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers(
    $first: Int
    $offset: Int
    $orderBy: [ManufacturersOrderBy!]
  ) {
    manufacturers(first: $first, offset: $offset, orderBy: $orderBy) {
      nodes {
        _id
        name
      }
      totalCount
    }
  }
`;

export const GET_MANUFACTURER_BY_ID = gql`
  query GetManufacturerById($id: ID!) {
    manufacturer(_id: $id) {
      _id
      name
    }
  }
`;
