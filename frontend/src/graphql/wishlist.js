import { gql } from "@apollo/client";

// Query to get wishlist
export const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist {
      _id
      userId
      itemCount
      items {
        _id
        productId
        addedAt
        product {
          _id
          name
          price
          imageUrl
          categoryId
          categoryName
          manufacturerId
          manufacturerName
        }
      }
    }
  }
`;

// Query to check if product is in wishlist
export const CHECK_WISHLIST_STATUS = gql`
  query CheckWishlistStatus($productId: ID!) {
    isProductInWishlist(productId: $productId)
  }
`;

// Mutation to add product to wishlist
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      _id
      userId
      itemCount
      items {
        _id
        productId
        addedAt
        product {
          _id
          name
          price
          imageUrl
          categoryId
          categoryName
          manufacturerId
          manufacturerName
        }
      }
    }
  }
`;

// Mutation to remove product from wishlist
export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      _id
      userId
      itemCount
      items {
        _id
        productId
        addedAt
        product {
          _id
          name
          price
          imageUrl
          categoryId
          categoryName
          manufacturerId
          manufacturerName
        }
      }
    }
  }
`;

// Mutation to clear wishlist
export const CLEAR_WISHLIST = gql`
  mutation ClearWishlist {
    clearWishlist {
      _id
      userId
      itemCount
      items {
        _id
        productId
        addedAt
        product {
          _id
          name
          price
          imageUrl
          categoryId
          categoryName
          manufacturerId
          manufacturerName
        }
      }
    }
  }
`;

// Mutation to move product from wishlist to cart
export const MOVE_WISHLIST_TO_CART = gql`
  mutation MoveWishlistToCart($productId: ID!) {
    moveWishlistToCart(productId: $productId) {
      _id
      userId
      totalItems
      totalPrice
      lastUpdated
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
    }
  }
`;

// Mutation to reorder wishlist items
export const REORDER_WISHLIST = gql`
  mutation ReorderWishlist($productIds: [ID!]!) {
    reorderWishlist(productIds: $productIds) {
      _id
      userId
      itemCount
      items {
        _id
        productId
        addedAt
        product {
          _id
          name
          price
          imageUrl
          categoryId
          categoryName
          manufacturerId
          manufacturerName
        }
      }
    }
  }
`;
