import { useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useAuth } from "./useAuth.js";
import {
  GET_CART,
  GET_CART_ITEM_COUNT,
  ADD_TO_CART,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../graphql/cart.js";

export const useCart = () => {
  const { isAuthenticated, getToken } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const apolloClient = useApolloClient();

  // Get cart data
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery(GET_CART, {
    skip: !isAuthenticated,
    context: {
      headers: {
        authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
      },
    },
    errorPolicy: "all",
  });

  // Get cart item count
  const {
    data: cartCountData,
    loading: cartCountLoading,
    refetch: refetchCartCount,
  } = useQuery(GET_CART_ITEM_COUNT, {
    skip: !isAuthenticated,
    context: {
      headers: {
        authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
      },
    },
    errorPolicy: "all",
  });

  // Add to cart mutation
  const [addToCartMutation, { loading: addingToCart }] = useMutation(
    ADD_TO_CART,
    {
      context: {
        headers: {
          authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
        },
      },
      update: (cache, { data }) => {
        // Optimistically update Apollo cache
        try {
          // Update cart query cache
          cache.writeQuery({
            query: GET_CART,
            data: {
              cart: data.addToCart,
            },
          });

          // Update cart count cache
          if (data.addToCart) {
            cache.writeQuery({
              query: GET_CART_ITEM_COUNT,
              data: {
                cartItemCount: data.addToCart.totalItems,
              },
            });
          }
        } catch (error) {
          // If cache update fails, fallback to refetch
          console.warn("Cache update failed, falling back to refetch:", error);
          refetchCart();
          refetchCartCount();
        }
      },
      onError: (error) => {
        console.error("❌ Error adding to cart:", error.message);
        // Refetch on error to ensure data consistency
        refetchCart();
        refetchCartCount();
      },
    }
  );

  // Update cart item quantity mutation
  const [updateQuantityMutation, { loading: updatingQuantity }] = useMutation(
    UPDATE_CART_ITEM_QUANTITY,
    {
      context: {
        headers: {
          authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
        },
      },
      update: (cache, { data }) => {
        // Optimistically update Apollo cache
        try {
          // Update cart query cache
          cache.writeQuery({
            query: GET_CART,
            data: {
              cart: data.updateCartItemQuantity,
            },
          });

          // Update cart count cache
          if (data.updateCartItemQuantity) {
            cache.writeQuery({
              query: GET_CART_ITEM_COUNT,
              data: {
                cartItemCount: data.updateCartItemQuantity.totalItems,
              },
            });
          }
        } catch (error) {
          // If cache update fails, fallback to refetch
          console.warn("Cache update failed, falling back to refetch:", error);
          refetchCart();
          refetchCartCount();
        }
      },
      onError: (error) => {
        console.error("❌ Update quantity mutation error:", error);
        // Refetch on error to ensure data consistency
        refetchCart();
        refetchCartCount();
      },
    }
  );

  // Remove from cart mutation
  const [removeFromCartMutation, { loading: removingFromCart }] = useMutation(
    REMOVE_FROM_CART,
    {
      context: {
        headers: {
          authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
        },
      },
      update: (cache, { data }) => {
        // Optimistically update Apollo cache
        try {
          console.log(
            "🔄 Updating cache after removeFromCart:",
            data.removeFromCart
          );

          // Update cart query cache
          const existingCart = cache.readQuery({ query: GET_CART });
          if (existingCart?.cart) {
            cache.writeQuery({
              query: GET_CART,
              data: {
                cart: data.removeFromCart,
              },
            });
            console.log("✅ Cart cache updated successfully");
          }

          // Update cart count cache
          const existingCount = cache.readQuery({ query: GET_CART_ITEM_COUNT });
          if (existingCount && data.removeFromCart) {
            cache.writeQuery({
              query: GET_CART_ITEM_COUNT,
              data: {
                cartItemCount: data.removeFromCart.totalItems,
              },
            });
            console.log("✅ Cart count cache updated successfully");
          }
        } catch (error) {
          // If cache update fails, fallback to refetch
          console.warn(
            "⚠️ Cache update failed, falling back to refetch:",
            error
          );
          refetchCart();
          refetchCartCount();
        }
      },
      onError: (error) => {
        console.error("❌ Remove from cart mutation error:", error);
        // Refetch on error to ensure data consistency
        refetchCart();
        refetchCartCount();
      },
    }
  );

  // Clear cart mutation
  const [clearCartMutation, { loading: clearingCart }] = useMutation(
    CLEAR_CART,
    {
      context: {
        headers: {
          authorization: isAuthenticated ? `Bearer ${getToken()}` : "",
        },
      },
      update: (cache, { data }) => {
        // Optimistically update Apollo cache
        try {
          // Update cart query cache
          cache.writeQuery({
            query: GET_CART,
            data: {
              cart: data.clearCart,
            },
          });

          // Update cart count cache
          cache.writeQuery({
            query: GET_CART_ITEM_COUNT,
            data: {
              cartItemCount: 0,
            },
          });
        } catch (error) {
          // If cache update fails, fallback to refetch
          console.warn("Cache update failed, falling back to refetch:", error);
          refetchCart();
          refetchCartCount();
        }
      },
      onError: (error) => {
        console.error("❌ Clear cart mutation error:", error);
        // Refetch on error to ensure data consistency
        refetchCart();
        refetchCartCount();
      },
    }
  );

  // Listen for auth changes to reset cart state
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("🔄 Cart - Auth change detected");
      console.log("🔄 Cart - Current auth state:", isAuthenticated);

      if (isAuthenticated) {
        // User logged in - refetch cart data for new user
        console.log("👤 Cart - User logged in, fetching cart data");
        refetchCart();
        refetchCartCount();
      } else {
        // User logged out - clear cart data from Apollo cache
        console.log("👋 Cart - User logged out, clearing cart cache");
        apolloClient.cache.evict({
          fieldName: "cart",
        });
        apolloClient.cache.evict({
          fieldName: "cartItemCount",
        });
        apolloClient.cache.gc(); // Garbage collect
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [isAuthenticated, refetchCart, refetchCartCount, apolloClient]);

  // Helper functions
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
    }

    try {
      await addToCartMutation({
        variables: {
          item: {
            productId: product._id,
            productName: product.name,
            productPrice: product.price,
            productImageUrl: product.imageUrl,
            quantity: quantity,
            selectedSize: product.selectedSize || "",
            selectedColor: product.selectedColor || "",
          },
        },
      });
      return { success: true, message: "Đã thêm sản phẩm vào giỏ hàng" };
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      return { success: false, message: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      await updateQuantityMutation({
        variables: { productId, quantity },
      });
    } catch (error) {
      console.error("❌ Update quantity error:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      await removeFromCartMutation({
        variables: { productId },
      });
    } catch (error) {
      console.error("❌ Remove from cart error:", error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      await clearCartMutation();
    } catch (error) {
      console.error("❌ Clear cart error:", error);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  // Calculate derived values
  const cart = isAuthenticated ? cartData?.cart || null : null;
  const cartItems = isAuthenticated ? cart?.items || [] : [];
  const cartItemCount = isAuthenticated ? cartCountData?.cartItemCount || 0 : 0;
  const cartTotal = isAuthenticated ? cart?.totalPrice || 0 : 0;

  return {
    // Data
    cart,
    cartItems,
    cartItemCount,
    cartTotal,
    isCartOpen,

    // Loading states
    cartLoading,
    cartCountLoading,
    addingToCart,
    updatingQuantity,
    removingFromCart,
    clearingCart,

    // Errors
    cartError,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    refetchCart,
    refetchCartCount,
  };
};
