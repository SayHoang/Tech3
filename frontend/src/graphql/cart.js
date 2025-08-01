import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart {
    cart {
      _id
      userId
      items {
        productId
        productName
        productPrice
        productImageUrl
        quantity
        selectedSize
        selectedColor
        addedAt
      }
      totalItems
      totalPrice
      lastUpdated
    }
  }
`;

export const GET_CART_ITEM_COUNT = gql`
  query GetCartItemCount {
    cartItemCount
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($item: CartItemInput!) {
    addToCart(item: $item) {
      _id
      userId
      items {
        productId
        productName
        productPrice
        productImageUrl
        quantity
        selectedSize
        selectedColor
        addedAt
      }
      totalItems
      totalPrice
      lastUpdated
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($productId: ID!, $quantity: Int!) {
    updateCartItemQuantity(productId: $productId, quantity: $quantity) {
      _id
      userId
      items {
        productId
        productName
        productPrice
        productImageUrl
        quantity
        selectedSize
        selectedColor
        addedAt
      }
      totalItems
      totalPrice
      lastUpdated
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveCartItem($productId: ID!) {
    removeFromCart(productId: $productId) {
      _id
      userId
      items {
        productId
        productName
        productPrice
        productImageUrl
        quantity
        selectedSize
        selectedColor
        addedAt
      }
      totalItems
      totalPrice
      lastUpdated
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      _id
      userId
      items {
        productId
        productName
        productPrice
        productImageUrl
        quantity
        selectedSize
        selectedColor
        addedAt
      }
      totalItems
      totalPrice
      lastUpdated
    }
  }
`;
