import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customerName
      customerPhone
      status
      total
      createdAt
      items {
        id
        productId
        name
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      customerName
      customerPhone
      status
      total
      createdAt
      items {
        id
        productId
        name
        quantity
        price
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($first: Int, $offset: Int) {
    orders(first: $first, offset: $offset) {
      items {
        id
        customerName
        customerPhone
        status
        total
        createdAt
      }
      totalCount
    }
  }
`;
